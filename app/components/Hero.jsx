'use client';

import { useState } from 'react';

export default function Hero() {
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  return (
    <>
      <section id="hero" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-base">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(circle at 50% 34%, rgba(139,92,246,0.18), transparent 38%), radial-gradient(circle at 12% 78%, rgba(124,58,237,0.09), transparent 34%), linear-gradient(180deg, #0A0B0E 0%, #0D0E12 58%, #0A0B0E 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-25"
          aria-hidden="true"
          style={{
            backgroundImage:
              'linear-gradient(rgba(139,92,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.05) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 70% 65% at 50% 40%, black, transparent 78%)',
          }}
        />

        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div>
            <div>
              <span className="section-label">AI Developer · Zibtek · RAG &amp; LLM Systems</span>
            </div>
            <div>
              <h1 className="font-display mb-6 text-4xl font-extrabold sm:text-6xl md:text-7xl lg:text-8xl">
                <span className="block text-ink-primary">Sai Vishnu Vamsi</span>
                <span className="block text-gradient">Senagasetty</span>
              </h1>
            </div>
            <div>
              <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-ink-secondary md:text-2xl">
                AI Developer shipping{' '}
                <span className="font-semibold text-accent-bright">
                  production RAG chatbots, retrieval pipelines, and LLM products
                </span>
                {' '}— from existing prototypes to client-ready systems, fast.
              </p>
            </div>
            <div>
              <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <div className="flex items-center gap-3 font-display text-3xl font-bold text-accent">
                  <span>AI</span>
                  <span className="text-ink-muted">|</span>
                  <span className="text-accent-bright">ML</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsResumeOpen(true)}
                  className="shine-sweep btn-primary cursor-pointer px-8 py-4"
                >
                  <span className="relative z-10">VIEW RESUME</span>
                </button>
              </div>
            </div>
          </div>

          <div className="relative mx-auto max-w-md">
            <a
              href="#chatbot"
              className="glass glass-hover glass-glow group block rounded-2xl p-6 transition-transform hover:-translate-y-1"
              data-cursor="pointer"
            >
              <div className="absolute -right-2 -top-2 h-6 w-6 rounded-full border-2 border-base bg-accent chatbot-notification" />
              <div className="flex items-start gap-4 text-left">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-gradient-primary shadow-glow-sm">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="mb-1 text-lg font-bold text-ink-primary group-hover:text-accent-bright">
                    Ask the live RAG assistant
                  </h2>
                  <p className="text-sm text-ink-secondary">
                    Or try <strong className="text-accent">Am I a Fit?</strong> — paste a JD for an instant match score.
                  </p>
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      {isResumeOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-base/90 backdrop-blur-md"
          onClick={() => setIsResumeOpen(false)}
        >
          <div
            className="glass glass-glow relative h-[90vh] w-[90vw] max-w-6xl overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsResumeOpen(false)}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-surface-elevated text-ink-primary hover:bg-accent/20"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M16 4L4 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            <iframe src="/resume/VishnuVamsi_AIEngineer.pdf" className="h-full w-full border-0 bg-white" title="Resume" />
          </div>
        </div>
      )}
    </>
  );
}
