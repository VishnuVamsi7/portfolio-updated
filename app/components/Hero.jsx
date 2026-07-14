'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import HeroInkBackground from './effects/HeroInkBackground';
import CompanionAnchor from './three/CompanionAnchor';
import MagneticButton from './effects/MagneticButton';
import { StaggerReveal, StaggerItem } from './effects/SectionReveal';

const HeroScene = dynamic(() => import('./three/HeroScene'), { ssr: false });
const HeroShaderBackground = dynamic(() => import('./effects/HeroShaderBackground'), { ssr: false });

export default function Hero() {
  const [showChatPrompt, setShowChatPrompt] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowChatPrompt(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <section id="hero" className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-base">
        <HeroShaderBackground />
        <HeroInkBackground />
        <HeroScene />

        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <StaggerReveal>
            <StaggerItem>
              <span className="section-label">AI Engineer · Machine Learning Engineer</span>
            </StaggerItem>
            <StaggerItem>
              <CompanionAnchor id="hero" className="mx-auto mb-2" />
              <h1 className="font-display mb-6 text-6xl font-extrabold md:text-7xl lg:text-8xl">
                <span className="block text-ink-primary">Sai Vishnu Vamsi</span>
                <span className="block text-gradient">Senagasetty</span>
              </h1>
            </StaggerItem>
            <StaggerItem>
              <p className="mx-auto mb-12 max-w-4xl text-xl leading-relaxed text-ink-secondary md:text-2xl">
                AI Engineer and Machine Learning Engineer specializing in{' '}
                <span className="font-semibold text-accent-bright">RAG systems, LLM deployment, and production ML pipelines</span>
                {' '}— built to ship, not just demo.
              </p>
            </StaggerItem>
            <StaggerItem>
              <div className="mb-16 flex flex-col items-center justify-center gap-6 sm:flex-row">
                <div className="flex items-center gap-3 font-display text-3xl font-bold text-accent">
                  <span>AI</span>
                  <span className="text-ink-muted">|</span>
                  <span className="text-accent-bright">ML</span>
                </div>
                <MagneticButton onClick={() => setIsResumeOpen(true)} className="px-8 py-4">
                  VIEW RESUME
                </MagneticButton>
              </div>
            </StaggerItem>
          </StaggerReveal>

          <motion.div
            className={`relative mx-auto max-w-md transition-all duration-1000 ${
              showChatPrompt ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}
          >
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
          </motion.div>
        </div>
      </section>

      {isResumeOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-base/90 backdrop-blur-md"
          onClick={() => setIsResumeOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
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
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
