'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import GradioShell from './GradioShell';

const PROMPTS = [
  'Cinematic shot of a cybernetic city at dusk, neon reflections on wet asphalt',
  'Portrait of an astronaut exploring a bioluminescent alien forest, 85mm lens',
  'Minimalist product render of a neural interface headset, studio lighting',
];

const OUTPUT_IMAGE = '/assets/imagecraft-cyber-city.png';

export default function ImageCraftGradio() {
  const [prompt, setPrompt] = useState(PROMPTS[0]);
  const [state, setState] = useState('idle');
  const [computing, setComputing] = useState(false);

  const generate = () => {
    setComputing(true);
    setState('loading');
    setTimeout(() => {
      setState('result');
      setComputing(false);
    }, 1500);
  };

  return (
    <GradioShell computing={computing} label="text2image">
      <label htmlFor="imagecraft-prompt" className="mb-2 block font-mono text-xs text-ink-muted">
        Prompt
      </label>
      <select
        id="imagecraft-prompt"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={state === 'loading'}
        className="mb-3 w-full cursor-pointer rounded-md border border-[#3a3b40] bg-[#0f1014] px-3 py-2 font-body text-sm text-ink-primary transition-colors duration-200 focus:border-accent/40 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-60"
      >
        {PROMPTS.map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>

      <AnimatePresence mode="wait">
        {state === 'result' ? (
          <motion.div
            key="image"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="relative aspect-video overflow-hidden rounded-md border border-line-subtle"
          >
            <Image
              src={OUTPUT_IMAGE}
              alt="Generated cybernetic city scene from ImageCraft demo"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
            <span className="absolute bottom-2 right-2 rounded bg-base/80 px-2 py-0.5 font-mono text-[10px] text-ink-muted backdrop-blur-sm">
              512×512 · 30 steps
            </span>
          </motion.div>
        ) : state === 'loading' ? (
          <motion.div
            key="skeleton"
            className="relative aspect-video overflow-hidden rounded-md border border-line-subtle bg-surface"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-ink-muted">
              Diffusion inference…
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="placeholder"
            className="flex aspect-video items-center justify-center rounded-md border border-dashed border-line-subtle bg-base/40 font-mono text-xs text-ink-muted"
          >
            Output will render here
          </motion.div>
        )}
      </AnimatePresence>

      {state !== 'result' && (
        <button
          type="button"
          onClick={generate}
          disabled={state === 'loading'}
          data-cursor="pointer"
          className="mt-3 cursor-pointer rounded-md border border-accent/40 bg-accent/15 px-4 py-2 font-mono text-xs font-semibold text-accent-bright transition-colors duration-200 hover:bg-accent/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:cursor-not-allowed disabled:opacity-50"
        >
          Generate
        </button>
      )}

      {state === 'result' && (
        <button
          type="button"
          onClick={() => setState('idle')}
          data-cursor="pointer"
          className="mt-3 cursor-pointer rounded-md border border-line-subtle px-3 py-1.5 font-mono text-[10px] text-ink-muted transition-colors duration-200 hover:border-line-hover hover:text-ink-primary"
        >
          Reset demo
        </button>
      )}
    </GradioShell>
  );
}
