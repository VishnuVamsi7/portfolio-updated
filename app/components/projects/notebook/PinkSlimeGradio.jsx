'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GradioShell from './GradioShell';

const SAMPLE_TEXT =
  'Local officials have reportedly uncovered shocking evidence that could change everything voters believe about the upcoming election. Experts say this breakthrough proves what many have suspected for years — a stunning development that demands immediate attention from every concerned citizen.';

const HIGHLIGHTS = [
  { phrase: 'shocking evidence', severity: 'high' },
  { phrase: 'could change everything', severity: 'high' },
  { phrase: 'stunning development', severity: 'medium' },
  { phrase: 'every concerned citizen', severity: 'medium' },
  { phrase: 'Experts say', severity: 'low' },
];

function highlightText(text) {
  let parts = [{ text, highlight: null }];
  HIGHLIGHTS.forEach(({ phrase, severity }) => {
    const next = [];
    parts.forEach((part) => {
      if (part.highlight) {
        next.push(part);
        return;
      }
      const idx = part.text.indexOf(phrase);
      if (idx === -1) {
        next.push(part);
        return;
      }
      if (idx > 0) next.push({ text: part.text.slice(0, idx), highlight: null });
      next.push({ text: phrase, highlight: severity });
      const after = part.text.slice(idx + phrase.length);
      if (after) next.push({ text: after, highlight: null });
    });
    parts = next;
  });
  return parts;
}

const SEVERITY_CLASS = {
  high: 'bg-red-500/30 text-red-200 ring-1 ring-red-400/40',
  medium: 'bg-amber-500/25 text-amber-100 ring-1 ring-amber-400/35',
  low: 'bg-yellow-500/20 text-yellow-100 ring-1 ring-yellow-400/30',
};

export default function PinkSlimeGradio() {
  const [text, setText] = useState(SAMPLE_TEXT);
  const [state, setState] = useState('idle'); // idle | loading | result
  const [computing, setComputing] = useState(false);

  const run = () => {
    setComputing(true);
    setState('loading');
    setTimeout(() => {
      setState('result');
      setComputing(false);
    }, 800);
  };

  const parts = highlightText(SAMPLE_TEXT);

  return (
    <GradioShell computing={computing} label="misinfo_detector">
      <label className="mb-2 block font-mono text-xs text-ink-muted">Article text</label>

      <AnimatePresence mode="wait">
        {state === 'result' ? (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-3"
          >
            <div className="rounded-md border border-line-subtle bg-base/60 p-3 font-body text-sm leading-relaxed text-ink-primary">
              {parts.map((p, i) =>
                p.highlight ? (
                  <mark key={i} className={`rounded px-0.5 ${SEVERITY_CLASS[p.highlight]}`}>
                    {p.text}
                  </mark>
                ) : (
                  <span key={i}>{p.text}</span>
                )
              )}
            </div>
            <div className="flex items-center justify-between rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2">
              <span className="font-mono text-xs text-red-300">Confidence</span>
              <span className="font-mono text-sm font-bold text-red-200">94% AI-Generated Misinformation</span>
            </div>
            <p className="font-mono text-[10px] text-ink-muted">
              Signatures: sentiment exaggeration · low lexical diversity · active-voice dominance
            </p>
          </motion.div>
        ) : (
          <motion.textarea
            key="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            disabled={state === 'loading'}
            className="w-full resize-none rounded-md border border-[#3a3b40] bg-[#0f1014] px-3 py-2 font-body text-sm text-ink-primary transition-colors duration-200 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
          />
        )}
      </AnimatePresence>

      {state === 'loading' && (
        <div className="mt-3 flex items-center gap-2 font-mono text-xs text-accent-bright">
          <motion.span
            className="inline-block h-3 w-3 rounded-full border-2 border-accent border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: 'linear' }}
          />
          Running signature extraction…
        </div>
      )}

      {state !== 'result' && (
        <button
          type="button"
          onClick={run}
          disabled={state === 'loading'}
          data-cursor="pointer"
          className="mt-3 cursor-pointer rounded-md border border-accent/40 bg-accent/15 px-4 py-2 font-mono text-xs font-semibold text-accent-bright transition-colors duration-200 hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Detect Signatures
        </button>
      )}

      {state === 'result' && (
        <button
          type="button"
          onClick={() => {
            setState('idle');
            setText(SAMPLE_TEXT);
          }}
          data-cursor="pointer"
          className="mt-3 cursor-pointer rounded-md border border-line-subtle px-3 py-1.5 font-mono text-[10px] text-ink-muted transition-colors duration-200 hover:border-line-hover hover:text-ink-primary"
        >
          Reset demo
        </button>
      )}
    </GradioShell>
  );
}
