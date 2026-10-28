'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { springOverlay } from '../lib/motion';

const RAG_ENDPOINT = 'https://chatbot-rag-mun6.onrender.com/receive';
// Shown instead of any backend error text: a recruiter must never read
// billing internals or stack traces as a chat message.
const FRIENDLY_DOWN_MESSAGE =
  'The assistant is temporarily down — please try again in a bit, or email me at saivishnuvamsis07@gmail.com.';
const REQUEST_TIMEOUT_MS = 60000;

/** "experience-zibtek-ai-part-2" -> "experience: zibtek ai part 2". */
function formatSource(source) {
  const label = String(source.id || 'source').replace(/-/g, ' ');
  return `${source.section || 'source'}: ${label}`;
}

function getOrCreateSessionId() {
  try {
    const stored = window.sessionStorage.getItem('rag-session-id');
    if (stored) return stored;
    const id = (window.crypto?.randomUUID && window.crypto.randomUUID()) || `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.sessionStorage.setItem('rag-session-id', id);
    return id;
  } catch {
    return `s-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }
}

export default function Chatbot() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState('chat');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! I'm your AI assistant. Ask me anything about Sai Vishnu Vamsi Senagasetty, his projects, skills, or background. Switch to JD Fit to paste a job description.",
    },
  ]);
  const [input, setInput] = useState('');
  const [jdText, setJdText] = useState('');
  const [jdResult, setJdResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const sessionIdRef = useRef(null);
  if (sessionIdRef.current === null && typeof window !== 'undefined') {
    sessionIdRef.current = getOrCreateSessionId();
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    // Retry only transient failures (network / 5xx). 4xx errors (bad input,
    // rate limit) will fail the same way again, so fail fast on them.
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const response = await fetch(RAG_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: currentInput, session_id: sessionIdRef.current }),
          signal: controller.signal,
        });

        if (!response.ok) {
          if (response.status >= 400 && response.status < 500) {
            throw Object.assign(new Error('client-error'), { status: response.status, noRetry: true });
          }
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const reply = data.response || 'No response received.';
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: reply, sources: (data.retrieved || []).slice(0, 3) },
        ]);
        setIsLoading(false);
        return;
      } catch (err) {
        attempt++;
        if (err.noRetry || attempt === maxRetries) {
          setMessages((prev) => [...prev, { role: 'assistant', content: FRIENDLY_DOWN_MESSAGE }]);
          setIsLoading(false);
        } else {
          await new Promise((r) => setTimeout(r, 1000));
        }
      } finally {
        clearTimeout(timeout);
      }
    }
  };

  const analyzeJD = async () => {
    if (!jdText.trim() || jdText.length < 20) {
      setError('Paste at least 20 characters of a job description.');
      return;
    }
    setIsLoading(true);
    setError('');
    setJdResult(null);

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const res = await fetch('/api/jd-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jdText }),
        });
        const data = await res.json();
        // 4xx (e.g. JD too short / too long) will fail the same way again.
        if (!res.ok && res.status >= 400 && res.status < 500) {
          setError(data.error || 'Analysis failed');
          setIsLoading(false);
          return;
        }
        if (!res.ok) throw new Error(data.error || 'Analysis failed');
        setJdResult(data);
        setIsLoading(false);
        return;
      } catch (err) {
        if (attempt === 2) {
          setError(err.message || 'Failed to analyze JD.');
          setIsLoading(false);
        } else {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (mode === 'chat') handleSend();
    }
  };

  const openFullJD = () => {
    setIsOpen(false);
    document.getElementById('jd-match')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence mode="wait">
      {!isOpen ? (
        <motion.button
          key="chatbot-fab"
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={springOverlay}
          onClick={() => setIsOpen(true)}
          className="group fixed bottom-6 right-6 z-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          aria-label="Open AI assistant"
        >
          <div className="absolute inset-0 animate-ping rounded-full bg-accent opacity-20" />
          <div className="animate-pulse-glow relative rounded-full bg-gradient-primary p-4 shadow-glow transition hover:scale-110">
            <svg className="relative h-7 w-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="absolute -right-1 -top-1 flex h-6 w-6 animate-bounce items-center justify-center rounded-full border-4 border-surface-elevated bg-accent-bright">
            <span className="text-xs font-bold text-white">!</span>
          </div>
        </motion.button>
      ) : (
        <motion.div
          key="chatbot-panel"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 24 }}
          transition={springOverlay}
          className="fixed bottom-6 right-6 z-50 flex h-[min(600px,calc(100vh-3rem))] w-[min(24rem,calc(100vw-3rem))] flex-col"
        >
          <div className="glass glass-glow relative flex h-full flex-col overflow-hidden rounded-2xl">
            <div className="flex items-center justify-between bg-gradient-primary p-4 text-white">
              <div>
                <h3 className="font-display text-lg font-bold">AI Assistant</h3>
                <p className="text-xs text-white/70">Chat · JD Fit matcher</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-2 transition hover:bg-white/20"
                aria-label="Close"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex border-b border-line-subtle">
              <button
                type="button"
                onClick={() => setMode('chat')}
                className={`flex-1 py-2 text-sm font-semibold transition ${mode === 'chat' ? 'border-b-2 border-accent text-accent-bright' : 'text-ink-muted hover:text-ink-secondary'}`}
              >
                Chat
              </button>
              <button
                type="button"
                onClick={() => setMode('jd')}
                className={`flex-1 py-2 text-sm font-semibold transition ${mode === 'jd' ? 'border-b-2 border-accent text-accent-bright' : 'text-ink-muted hover:text-ink-secondary'}`}
              >
                JD Fit
              </button>
            </div>

            {mode === 'chat' ? (
              <>
                <div className="flex-1 space-y-4 overflow-y-auto bg-surface/40 p-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] rounded-lg p-3 text-sm ${
                          message.role === 'user'
                            ? 'bg-accent text-white shadow-glow-sm'
                            : 'border border-line-subtle bg-surface-raised text-ink-primary'
                        }`}
                      >
                        {message.content}
                        {message.role === 'assistant' && message.sources?.length > 0 && (
                          <p className="mt-2 border-t border-line-subtle pt-2 text-[11px] leading-relaxed text-ink-muted">
                            Sources: {message.sources.map(formatSource).join(' · ')}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="rounded-lg border border-line-subtle bg-surface-raised p-3">
                        <div className="flex space-x-2">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent/60" />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent/60" style={{ animationDelay: '0.2s' }} />
                          <div className="h-2 w-2 animate-bounce rounded-full bg-accent/60" style={{ animationDelay: '0.4s' }} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-line-subtle bg-surface/60 p-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about skills, projects…"
                      className="flex-1 rounded-xl border border-line-subtle bg-surface px-4 py-2 text-ink-primary placeholder:text-ink-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                      disabled={isLoading}
                    />
                    <button
                      onClick={handleSend}
                      disabled={isLoading || !input.trim()}
                      className="btn-primary rounded-xl px-4 py-2 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-1 flex-col overflow-y-auto bg-surface/40 p-4">
                <textarea
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="Paste job description…"
                  rows={8}
                  className="w-full flex-1 resize-none rounded-xl border border-line-subtle bg-surface p-3 text-sm text-ink-primary placeholder:text-ink-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
                  disabled={isLoading}
                />
                {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
                {jdResult && (
                  <div className="glass mt-3 rounded-xl p-3 text-sm">
                    <p className="font-bold text-accent-bright">{jdResult.matchScore}% fit</p>
                    <p className="mt-1 text-ink-secondary">{jdResult.pitch}</p>
                    {jdResult.missingSkills?.length > 0 && (
                      <p className="mt-2 text-xs text-ink-muted">
                        Gaps to note: {jdResult.missingSkills.join(', ')}
                      </p>
                    )}
                    {jdResult.exposureSkills?.length > 0 && (
                      <p className="mt-1 text-xs text-ink-muted">
                        Familiar, not production: {jdResult.exposureSkills.join(', ')}
                      </p>
                    )}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={analyzeJD}
                    disabled={isLoading}
                    className="btn-primary flex-1 rounded-xl py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    {isLoading ? 'Analyzing…' : 'Analyze Fit'}
                  </button>
                  <button
                    type="button"
                    onClick={openFullJD}
                    className="rounded-xl border border-line-subtle px-3 py-2 text-xs text-ink-secondary transition hover:border-line-hover hover:text-ink-primary"
                  >
                    Full view
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
