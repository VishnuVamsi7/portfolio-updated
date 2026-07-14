'use client';

import { motion } from 'framer-motion';

export default function GradioShell({ children, computing, label = 'Output' }) {
  return (
    <motion.div
      className="relative bg-[#1a1b1f] px-4 py-4"
      animate={
        computing
          ? {
              boxShadow: [
                '0 0 0 rgba(139,92,246,0)',
                '0 0 20px rgba(139,92,246,0.35)',
                '0 0 0 rgba(139,92,246,0)',
              ],
            }
          : { boxShadow: '0 0 0 rgba(139,92,246,0)' }
      }
      transition={computing ? { duration: 1.2, repeat: Infinity } : { duration: 0.2 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
          Out [{label}]
        </span>
        <span className="rounded border border-line-subtle px-2 py-0.5 font-mono text-[10px] text-ink-muted">
          gradio · v4.0
        </span>
      </div>
      <div className="rounded-lg border border-[#2d2e33] bg-[#141519] p-4">{children}</div>
    </motion.div>
  );
}
