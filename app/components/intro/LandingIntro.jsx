'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'framer-motion';
import TechLogoArc, { INTRO_TECH_STACK } from './TechLogoArc';

const SESSION_KEY = 'introPlayed';
const EXIT_MS = 0.55;
const DISMISS_DISTANCE = () =>
  typeof window !== 'undefined' ? Math.min(220, window.innerHeight * 0.28) : 180;
const DISMISS_VELOCITY = -650;
const SILHOUETTE_SRC = '/assets/silhouette-transparent.webp?v=3';

function clearIntroPending() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('intro-pending');
  document.getElementById('intro-boot-scrim')?.remove();
}

function useArcRadius() {
  const [radius, setRadius] = useState(220);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 480) setRadius(132);
      else if (w < 768) setRadius(168);
      else if (w < 1024) setRadius(200);
      else setRadius(232);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return radius;
}

function NameReveal({ text }) {
  const chars = useMemo(() => Array.from(text), [text]);

  return (
    <motion.h1
      className="font-display relative z-30 w-full text-center text-4xl font-extrabold tracking-tight text-ink-primary sm:text-5xl md:text-6xl lg:text-7xl"
      aria-label={text}
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.04, delayChildren: 0 } },
      }}
    >
      {chars.map((ch, i) => (
        <motion.span
          key={`${ch}-${i}`}
          className="inline-block"
          variants={{
            hidden: { opacity: 0, y: 18 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.35, ease: 'easeOut' },
            },
          }}
        >
          {ch === ' ' ? '\u00A0' : ch}
        </motion.span>
      ))}
    </motion.h1>
  );
}

function SlideUpHint({ visible }) {
  if (!visible) return null;
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-0 bottom-8 z-40 flex flex-col items-center justify-center gap-2 sm:bottom-10"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <p className="w-full text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink-secondary sm:text-xs">
        Slide up to enter
      </p>
      <motion.div
        className="flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-surface/70 text-accent-bright shadow-glow-sm backdrop-blur-md"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </motion.div>
      <div className="mt-1 h-1 w-10 rounded-full bg-ink-muted/40" aria-hidden="true" />
    </motion.div>
  );
}

/**
 * One-time (per session) landing intro. Stays until the user slides the panel
 * upward (drag / swipe) — no auto-dismiss timer.
 * Parent only mounts this when the intro should play.
 */
export default function LandingIntro({ onComplete }) {
  const reduceMotion = useReducedMotion();
  const arcRadius = useArcRadius();
  // Start in play immediately — never leave a gap where the main page shows through.
  const [phase, setPhase] = useState('play'); // play | exit | done
  const [logoReady, setLogoReady] = useState(false);
  const [nameReady, setNameReady] = useState(false);
  const [hintReady, setHintReady] = useState(false);

  const dragY = useMotionValue(0);
  const dragProgress = useTransform(dragY, [0, -180], [0, 1]);
  const scrimOpacity = useTransform(dragProgress, [0, 1], [1, 0.4]);

  const finish = useCallback(() => {
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      /* private mode */
    }
    clearIntroPending();
    setPhase('done');
    onComplete?.();
  }, [onComplete]);

  const triggerExit = useCallback(() => {
    setPhase((prev) => (prev === 'exit' || prev === 'done' ? prev : 'exit'));
  }, []);

  useLayoutEffect(() => {
    clearIntroPending();
    if (reduceMotion) {
      finish();
    }
  }, [reduceMotion, finish]);

  useEffect(() => {
    if (phase !== 'play' && phase !== 'exit') return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'play') return undefined;

    const logoTimer = window.setTimeout(() => setLogoReady(true), 1000);
    const nameTimer = window.setTimeout(() => setNameReady(true), 1800);
    const hintTimer = window.setTimeout(() => setHintReady(true), 2400);

    return () => {
      window.clearTimeout(logoTimer);
      window.clearTimeout(nameTimer);
      window.clearTimeout(hintTimer);
    };
  }, [phase]);

  useEffect(() => {
    if (phase !== 'play') return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') triggerExit();
      if (hintReady && (e.key === 'ArrowUp' || e.key === 'PageUp' || e.key === ' ')) {
        e.preventDefault();
        triggerExit();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, triggerExit, hintReady]);

  const handleDragEnd = useCallback(
    (_event, info) => {
      const threshold = DISMISS_DISTANCE();
      const draggedFarEnough = info.offset.y <= -threshold;
      const flickedUp = info.velocity.y <= DISMISS_VELOCITY;
      if (draggedFarEnough || flickedUp) {
        triggerExit();
      }
    },
    [triggerExit],
  );

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      {(phase === 'play' || phase === 'exit') && (
        <motion.div
          key="landing-intro"
          className="fixed inset-0 z-[200] flex touch-none flex-col items-center justify-center overflow-hidden bg-base"
          style={{
            backgroundColor: '#0A0B0E',
            ...(phase === 'play' ? { y: dragY, opacity: scrimOpacity } : {}),
          }}
          role="dialog"
          aria-modal="true"
          aria-label="Portfolio introduction. Slide up to enter the site."
          drag={phase === 'play' ? 'y' : false}
          dragConstraints={{ top: -480, bottom: 0 }}
          dragElastic={{ top: 0.12, bottom: 0.25 }}
          dragMomentum={false}
          dragDirectionLock
          onDragEnd={handleDragEnd}
          initial={{ opacity: 1, y: 0 }}
          animate={
            phase === 'exit'
              ? { y: '-105%', opacity: 1, transition: { duration: EXIT_MS, ease: 'easeInOut' } }
              : undefined
          }
          onAnimationComplete={() => {
            if (phase === 'exit') finish();
          }}
        >
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            style={{
              background:
                'radial-gradient(ellipse 80% 55% at 50% 42%, rgba(124,58,237,0.16) 0%, transparent 55%), linear-gradient(180deg, #0A0B0E 0%, #0D0E12 55%, #0A0B0E 100%)',
            }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              triggerExit();
            }}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute right-4 top-4 z-50 rounded-lg border border-line-subtle bg-surface/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-secondary backdrop-blur-md transition-colors hover:border-accent/40 hover:text-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent sm:right-6 sm:top-6"
            data-cursor="pointer"
          >
            Skip →
          </button>

          <div className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center px-4 pb-20 pt-6">
            <div className="relative mx-auto h-[min(52vh,480px)] w-full max-w-lg sm:h-[min(56vh,540px)]">
              <motion.div
                className="pointer-events-none absolute left-1/2 top-[48%] h-[70%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(124,58,237,0.55) 0%, rgba(139,92,246,0.28) 35%, rgba(167,139,250,0.08) 58%, transparent 72%)',
                }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  opacity: { delay: 0.15, duration: 0.7, ease: 'easeOut' },
                  scale: {
                    delay: 0.9,
                    duration: 3.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  },
                }}
              />

              <motion.div
                className="pointer-events-none absolute inset-0 flex items-end justify-center pb-[4%] sm:pb-[2%]"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.75, ease: 'easeOut' }}
              >
                <Image
                  src={SILHOUETTE_SRC}
                  alt=""
                  width={720}
                  height={720}
                  priority
                  unoptimized
                  className="mx-auto h-auto w-[min(78vw,420px)] select-none object-contain sm:w-[min(70vw,480px)]"
                  style={{
                    filter:
                      'drop-shadow(0 0 8px rgba(139,92,246,0.95)) drop-shadow(0 0 22px rgba(124,58,237,0.7)) drop-shadow(0 0 48px rgba(124,58,237,0.4))',
                  }}
                  draggable={false}
                />
              </motion.div>

              {logoReady && (
                <TechLogoArc
                  logos={INTRO_TECH_STACK}
                  radius={arcRadius}
                  startAngle={-155}
                  endAngle={-25}
                />
              )}
            </div>

            {nameReady && (
              <div className="relative z-30 mx-auto mt-1 flex w-full max-w-xl flex-col items-center text-center sm:mt-2">
                <NameReveal text="Vishnu S" />
                <motion.p
                  className="mt-2 w-full text-center font-mono text-[10px] uppercase tracking-[0.28em] text-accent-bright/80 sm:text-xs"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45, duration: 0.5 }}
                >
                  AI Developer
                </motion.p>
              </div>
            )}
          </div>

          <SlideUpHint visible={hintReady && phase === 'play'} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function hasIntroPlayed() {
  if (typeof window === 'undefined') return true;
  try {
    return sessionStorage.getItem(SESSION_KEY) === 'true';
  } catch {
    return false;
  }
}
