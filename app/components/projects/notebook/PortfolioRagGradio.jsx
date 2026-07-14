'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import GradioShell from './GradioShell';

const QUICK_PROMPTS = [
  {
    label: 'Vector databases',
    query: 'What is his experience with vector databases?',
    response:
      'Sai has hands-on RAG experience with embedding pipelines and retrieval layers — indexing profile and project context for the portfolio assistant. He uses structured retrieval over custom indexes and has worked with vector DB patterns in LangChain-style orchestration for production Groq deployments.',
  },
  {
    label: 'Groq deployment',
    query: 'How does he deploy models with Groq?',
    response:
      'The portfolio RAG assistant runs on Groq inference with ~40–50% faster token generation vs baseline. FastAPI on Render serves the backend; the Next.js frontend streams responses with low-latency UX patterns.',
  },
  {
    label: 'Top ML project',
    query: 'What is his strongest ML project?',
    response:
      'Pink Slime Journalism Analysis: 27,000+ sentences clustered across categories, revealing 3× sentiment exaggeration in misinformation content. TensorFlow vs TorchServe benchmark on Azure is another flagship production-ML deliverable.',
  },
];

export default function PortfolioRagGradio() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [streamingText, setStreamingText] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [computing, setComputing] = useState(false);
  const scrollRef = useRef(null);

  const streamReply = useCallback((query, reply) => {
    setComputing(true);
    setStreaming(true);
    setStreamingText('');
    setMessages((m) => [...m, { role: 'user', text: query }]);

    let i = 0;
    const id = setInterval(() => {
      i += 3;
      setStreamingText(reply.slice(0, i));
      if (i >= reply.length) {
        clearInterval(id);
        setMessages((m) => [...m, { role: 'assistant', text: reply }]);
        setStreamingText('');
        setStreaming(false);
        setComputing(false);
      }
    }, 10);
  }, []);

  const submit = (query) => {
    const match =
      QUICK_PROMPTS.find((p) => p.query === query) ??
      QUICK_PROMPTS.find((p) => query.toLowerCase().includes('vector'));
    const reply =
      match?.response ??
      "I can answer questions about Sai's skills, RAG systems, Groq deployments, and featured projects. Try a quick-prompt below.";
    streamReply(query, reply);
    setInput('');
  };

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, streamingText]);

  return (
    <GradioShell computing={computing} label="groq_rag_chat">
      <div
        ref={scrollRef}
        className="mb-3 max-h-48 space-y-2 overflow-y-auto rounded-md border border-[#3a3b40] bg-[#0f1014] p-3"
        aria-live="polite"
      >
        {messages.length === 0 && !streaming && (
          <p className="font-mono text-xs text-ink-muted">// groq inference ready — select a quick-prompt</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-md px-3 py-2 text-sm ${
              msg.role === 'user'
                ? 'ml-6 border border-accent/20 bg-accent/10 text-ink-primary'
                : 'mr-6 border border-line-subtle bg-surface/80 text-ink-secondary'
            }`}
          >
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-ink-muted">
              {msg.role === 'user' ? 'you' : 'assistant'}
            </span>
            {msg.text}
          </div>
        ))}
        {streaming && streamingText && (
          <div className="mr-6 rounded-md border border-line-subtle bg-surface/80 px-3 py-2 text-sm text-ink-secondary">
            <span className="mb-1 block font-mono text-[10px] uppercase tracking-wider text-accent-bright">
              assistant · streaming
            </span>
            {streamingText}
            <motion.span
              className="ml-0.5 inline-block text-accent-bright"
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              ▌
            </motion.span>
          </div>
        )}
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map((p) => (
          <button
            key={p.label}
            type="button"
            onClick={() => submit(p.query)}
            disabled={streaming}
            data-cursor="pointer"
            className="cursor-pointer rounded-full border border-line-subtle px-2.5 py-1 font-mono text-[10px] text-ink-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40"
          >
            {p.label}
          </button>
        ))}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim() && !streaming) submit(input.trim());
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about skills, RAG, Groq…"
          disabled={streaming}
          className="flex-1 rounded-md border border-[#3a3b40] bg-[#0f1014] px-3 py-2 font-body text-sm text-ink-primary transition-colors duration-200 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          data-cursor="pointer"
          className="cursor-pointer rounded-md border border-accent/40 bg-accent/15 px-4 py-2 font-mono text-xs font-semibold text-accent-bright transition-colors duration-200 hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </GradioShell>
  );
}
