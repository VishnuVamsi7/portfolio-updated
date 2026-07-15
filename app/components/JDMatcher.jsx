'use client';

import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import MagneticButton from './effects/MagneticButton';
import SectionBackground from './effects/SectionBackground';
import { StaggerReveal, StaggerItem } from './effects/SectionReveal';

function ScoreRing({ score }) {
  const reduceMotion = useReducedMotion();
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative mx-auto h-36 w-36">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <motion.circle
          cx="60"
          cy="60"
          r="54"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reduceMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: 'spring', stiffness: 60, damping: 18, duration: 1.2 }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A78BFA" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-3xl font-bold text-ink-primary">{score}%</span>
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Fit</span>
      </div>
    </div>
  );
}

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState('');
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setDisplayed(text);
      return;
    }
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i += 1;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(interval);
    }, 18);
    return () => clearInterval(interval);
  }, [text, reduceMotion]);

  return <p className="leading-relaxed text-ink-secondary">{displayed}</p>;
}

export default function JDMatcher({ onOpenProject }) {
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const analyze = async () => {
    if (!jdText.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    const maxRetries = 3;
    for (let i = 0; i < maxRetries; i++) {
      setAttempt(i + 1);
      try {
        const res = await fetch('/api/jd-match', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jdText }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Analysis failed');
        setResult(data);
        setLoading(false);
        return;
      } catch (err) {
        if (i === maxRetries - 1) {
          setError(err.message || 'Failed to analyze. Please try again.');
          setLoading(false);
        } else {
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setJdText(text);
    } catch {
      setError('Could not read clipboard. Paste manually with Ctrl+V.');
    }
  };

  return (
    <section id="jd-match" className="relative isolate bg-transparent py-24">
      <SectionBackground variant="grid" />
      <div className="container relative mx-auto px-4">
        <StaggerReveal className="mx-auto mb-12 max-w-3xl text-center">
          <StaggerItem><span className="section-label">For Recruiters</span></StaggerItem>
          <StaggerItem>
            <h2 className="section-title">
              Am I a <span className="text-gradient">Fit?</span>
            </h2>
          </StaggerItem>
          <StaggerItem>
            <p className="text-lg text-ink-secondary">
              Paste a job description or list required skills. Get an instant match score, tailored pitch,
              and the most relevant projects from this portfolio.
            </p>
          </StaggerItem>
          <StaggerItem><div className="section-divider" /></StaggerItem>
        </StaggerReveal>

        <div className="glass mx-auto mb-8 max-w-3xl rounded-2xl p-4 text-sm text-ink-secondary">
          <p>
            <strong className="text-ink-primary">Sai Vishnu Vamsi Senagasetty</strong> is an AI Developer at Zibtek
            shipping confidential production RAG chatbots and LLM backends (Python/FastAPI, FAISS, React/Next/NestJS)
            with STAR-framed measurable gains—e.g. ~45% fewer ungrounded answers and ~40–50% faster delivery cycles.
            Personal builds include TwinMind, AlphaBot, ResumeLLM, AutoDoc-AI, and e-commerce RAG, plus NLP/CV research.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <textarea
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste job description here… e.g. 'Seeking ML Engineer with Python, PyTorch, RAG, Docker, NLP experience…'"
            rows={6}
            className="w-full resize-y rounded-2xl border border-line-subtle bg-surface p-4 text-ink-primary shadow-glass transition placeholder:text-ink-muted focus:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent/20"
            disabled={loading}
          />

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handlePaste}
              className="rounded-xl border border-line-subtle bg-surface px-6 py-3 font-semibold text-ink-secondary transition hover:border-line-hover hover:bg-surface-raised"
              data-cursor="pointer"
            >
              Paste JD
            </button>
            <MagneticButton
              onClick={analyze}
              disabled={loading || jdText.trim().length < 20}
              className="btn-primary shine-sweep rounded-xl px-8 py-3 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? `Analyzing… (attempt ${attempt}/3)` : 'Analyze Fit'}
            </MagneticButton>
          </div>

          {loading && (
            <p className="mt-4 text-sm text-accent-bright">
              Matching skills and projects… This is usually instant.
            </p>
          )}

          {error && (
            <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
          )}

          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
              className="glass glass-glow mt-8 rounded-2xl p-8"
            >
              <div className="grid gap-8 md:grid-cols-[auto_1fr]">
                <ScoreRing score={result.matchScore} />
                <div>
                  <h3 className="font-display mb-2 text-xl font-bold text-ink-primary">Tailored Pitch</h3>
                  <TypewriterText text={result.pitch} />
                  {result.matchedSkills?.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {result.matchedSkills.map((s) => (
                        <span key={s} className="rounded-full border border-accent/30 bg-accent-muted px-3 py-1 text-xs font-semibold text-accent-bright">
                          ✓ {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {result.projects?.length > 0 && (
                <div className="mt-8">
                  <h4 className="font-display mb-4 text-lg font-bold text-ink-primary">Top Matching Projects</h4>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {result.projects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => onOpenProject?.(p.id)}
                        className="glass-hover rounded-xl border border-line-subtle bg-surface/60 p-4 text-left transition hover:border-accent/30"
                        data-cursor="pointer"
                      >
                        <p className="font-semibold text-ink-primary">{p.title}</p>
                        <p className="mt-1 text-xs text-ink-muted">{p.reasons?.join(' · ')}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
