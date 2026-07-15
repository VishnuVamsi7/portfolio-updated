'use client';

import { useCallback, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { springSmooth } from '../../lib/motion';
import StaticBio from './StaticBio';
import MachineBio from './MachineBio';
import ModeToggle from './ModeToggle';

function RobotAvatar({ reduceMotion }) {
  return (
    <div className="relative flex shrink-0 flex-col items-center">
      <motion.div
        layout={!reduceMotion}
        className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-line-subtle bg-gradient-to-br from-surface-elevated to-base shadow-glass"
        animate={reduceMotion ? undefined : { boxShadow: '0 0 20px rgba(139, 92, 246, 0.12)' }}
        transition={{ duration: 0.3 }}
      >
        <svg viewBox="0 0 48 48" className="h-10 w-10" aria-hidden="true">
          <rect x="10" y="14" width="28" height="22" rx="6" fill="#1A1D24" stroke="#8B5CF6" strokeWidth="1.5" />
          <circle cx="19" cy="24" r="3" fill="#A78BFA" />
          <circle cx="29" cy="24" r="3" fill="#A78BFA" />
          <path d="M20 31h8" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M24 8v6" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="24" cy="6" r="2" fill="#8B5CF6" />
        </svg>
      </motion.div>
    </div>
  );
}

export default function LiveInferenceBio() {
  const reduceMotion = useReducedMotion();
  const [isMachine, setIsMachine] = useState(false);
  const [machineKey, setMachineKey] = useState(0);

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);

  const rotateX = useSpring(useTransform(py, [0, 1], [5, -5]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-5, 5]), { stiffness: 150, damping: 18 });
  const borderGlare = useMotionTemplate`radial-gradient(200px circle at ${gx}px ${gy}px, rgba(167,139,250,0.75), transparent 70%)`;
  const fillGlare = useMotionTemplate`radial-gradient(300px circle at ${gx}px ${gy}px, rgba(139,92,246,0.12), transparent 68%)`;

  const handleMove = useCallback(
    (e) => {
      if (reduceMotion) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      px.set(localX / rect.width);
      py.set(localY / rect.height);
      gx.set(localX);
      gy.set(localY);
    },
    [reduceMotion, px, py, gx, gy]
  );

  const handleLeave = useCallback(() => {
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  const handleModeToggle = useCallback(() => {
    setIsMachine((prev) => {
      const next = !prev;
      if (next) setMachineKey((k) => k + 1);
      return next;
    });
  }, []);

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        layout={!reduceMotion}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glass relative overflow-hidden rounded-2xl p-8 md:p-10"
      >
        {!reduceMotion && (
          <>
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-screen opacity-60"
              style={{ background: fillGlare }}
            />
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl opacity-70"
              style={{
                background: borderGlare,
                padding: '1.5px',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
          </>
        )}

        <div className="relative" style={reduceMotion ? undefined : { transform: 'translateZ(32px)' }}>
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-start gap-5">
              <RobotAvatar reduceMotion={reduceMotion} />
              <div className="min-w-0 flex-1 pt-1">
                <h3 className="font-display text-2xl font-bold text-ink-primary md:text-3xl">
                  Sai Vishnu Vamsi
                </h3>
                <p className="font-medium text-ink-secondary">AI Developer · Zibtek</p>
              </div>
            </div>
            <ModeToggle
              isMachine={isMachine}
              onToggle={handleModeToggle}
              reduceMotion={reduceMotion}
            />
          </div>

          <motion.div layout={!reduceMotion} className="relative min-h-[248px] md:min-h-[228px]">
            <AnimatePresence mode="wait" initial={false}>
              {isMachine ? (
                <motion.div
                  key="machine"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <MachineBio key={machineKey} reduceMotion={reduceMotion} />
                </motion.div>
              ) : (
                <motion.div
                  key="human"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
                  transition={springSmooth}
                >
                  <StaticBio />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
