'use client';

import { motion } from 'framer-motion';

const knobTransition = (reduceMotion) =>
  reduceMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 26 };

function Segment({ active, children, reduceMotion }) {
  return (
    <span className="relative rounded-full px-2.5 py-1">
      {active && (
        <motion.span
          layoutId="bio-mode-knob"
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-bright shadow-glow-sm"
          transition={knobTransition(reduceMotion)}
        />
      )}
      <span className={`relative z-10 transition-colors duration-200 ${active ? 'text-base' : 'text-ink-muted'}`}>
        {children}
      </span>
    </span>
  );
}

export default function ModeToggle({ isMachine, onToggle, reduceMotion, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMachine}
      aria-disabled={disabled}
      aria-label={isMachine ? 'Switch to human-readable bio' : 'Switch to machine-readable JSON'}
      onClick={disabled ? undefined : onToggle}
      data-cursor="pointer"
      className={`flex shrink-0 items-center gap-1 rounded-full border border-line-subtle bg-base/60 p-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
        disabled
          ? 'cursor-not-allowed opacity-40'
          : 'cursor-pointer hover:border-line-hover'
      }`}
    >
      <Segment active={!isMachine} reduceMotion={reduceMotion}>
        Human
      </Segment>
      <Segment active={isMachine} reduceMotion={reduceMotion}>
        Machine
      </Segment>
    </button>
  );
}
