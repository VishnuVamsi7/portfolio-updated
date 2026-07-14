'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GIT_RELEASES } from '../../lib/gitChangelogData';
import DiffStatBlock from './DiffStatBlock';

export default function GitChangelog() {
  const [expandedId, setExpandedId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  const toggle = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="relative mx-auto max-w-4xl">
      {/* Vertical git line */}
      <div
        className="pointer-events-none absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-accent/60 via-line-subtle to-line-subtle md:left-[15px]"
        aria-hidden="true"
      />

      <ul className="space-y-4">
        {GIT_RELEASES.map((release, index) => {
          const isExpanded = expandedId === release.id;
          const isHovered = hoveredId === release.id;
          const isLatest = index === 0;

          return (
            <li key={release.id} className="relative flex gap-4 md:gap-6">
              {/* Commit node */}
              <div className="relative z-10 flex shrink-0 flex-col items-center pt-5">
                <motion.span
                  className="h-6 w-6 rounded-full border-2 md:h-7 md:w-7"
                  animate={{
                    borderColor: isHovered || isExpanded ? '#A78BFA' : 'rgba(139,92,246,0.45)',
                    backgroundColor: isHovered || isExpanded ? 'rgba(139,92,246,0.35)' : '#14161B',
                    boxShadow:
                      isHovered || isExpanded
                        ? '0 0 16px rgba(139,92,246,0.45)'
                        : '0 0 0 rgba(139,92,246,0)',
                  }}
                  transition={{ duration: 0.2 }}
                  aria-hidden="true"
                />
                {isLatest && (
                  <span className="mt-1 font-mono text-[9px] uppercase tracking-wider text-accent-bright">
                    HEAD
                  </span>
                )}
              </div>

              {/* PR card */}
              <motion.article
                layout
                className="min-w-0 flex-1"
                onMouseEnter={() => setHoveredId(release.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <button
                  type="button"
                  onClick={() => toggle(release.id)}
                  aria-expanded={isExpanded}
                  data-cursor="pointer"
                  className="w-full cursor-pointer rounded-xl border border-line-subtle bg-surface/60 text-left transition-colors duration-200 hover:border-accent/30 hover:bg-surface-raised/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-4 md:px-5">
                    <div className="min-w-0 flex-1">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded border border-accent/35 bg-accent/10 px-2 py-0.5 font-mono text-xs font-semibold text-accent-bright">
                          {release.version}
                        </span>
                        {release.versionLabel && (
                          <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                            {release.versionLabel}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-bold text-ink-primary md:text-xl">
                        {release.title}
                      </h3>
                      <p className="mt-0.5 text-sm font-medium text-ink-secondary">{release.company}</p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        {release.type && (
                          <span className="rounded border border-line-subtle px-2 py-0.5 font-mono text-[10px] text-ink-muted">
                            {release.type}
                          </span>
                        )}
                        {release.location && (
                          <span className="font-mono text-[10px] text-ink-muted">{release.location}</span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-ink-muted">
                        commit <span className="text-accent-bright/80">{release.commitHash}</span>
                        {' · '}
                        {release.date}
                      </p>
                    </div>
                    <motion.span
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="mt-1 shrink-0 text-ink-muted"
                      aria-hidden="true"
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </motion.span>
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      key="diff"
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <DiffStatBlock stats={release.diffStats} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
