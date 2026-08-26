'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const SESSION_KEY = 'introPlayed';
/** Primary Gojo-styled cinematic (portfolio-recolored via CSS). */
export const GOJO_VIDEO_SRC = '/assets/intro/eyes-opening.mp4';
const FADE_MS = 500;
const FAILSAFE_MS = 28000;

function usePrefersReducedMotion() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  return reduceMotion;
}

function clearIntroPending() {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.remove('intro-pending');
  document.getElementById('intro-boot-scrim')?.remove();
}

/**
 * Flow: fullscreen Gojo video → fade → Hero drops in (via HomePage).
 * One-shot per session. Skip always available.
 */
export default function LandingIntro({ onExitStart, onComplete }) {
  const reduceMotion = usePrefersReducedMotion();
  const videoRef = useRef(null);
  const finishedRef = useRef(false);

  const [phase, setPhase] = useState('video'); // video | fade | done
  const [videoReady, setVideoReady] = useState(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    try {
      sessionStorage.setItem(SESSION_KEY, 'true');
    } catch {
      /* private mode */
    }
    clearIntroPending();
    setPhase('done');
    onComplete?.();
  }, [onComplete]);

  const beginExit = useCallback(() => {
    if (finishedRef.current) return;
    setPhase((prev) => (prev === 'done' || prev === 'fade' ? prev : 'fade'));
    onExitStart?.();
    window.setTimeout(finish, FADE_MS);
  }, [finish, onExitStart]);

  const skip = useCallback(() => {
    onExitStart?.();
    finish();
  }, [finish, onExitStart]);

  useEffect(() => {
    if (reduceMotion) {
      skip();
      return undefined;
    }

    clearIntroPending();
    document.getElementById('intro-boot-scrim')?.remove();

    const failsafe = window.setTimeout(skip, FAILSAFE_MS);
    return () => window.clearTimeout(failsafe);
  }, [reduceMotion, skip]);

  useEffect(() => {
    if (phase !== 'video' || reduceMotion) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    const onEnded = () => beginExit();
    const onLoaded = () => setVideoReady(true);

    video.addEventListener('ended', onEnded);
    video.addEventListener('loadeddata', onLoaded);
    video.loop = false;
    video.muted = true;
    video.playsInline = true;

    const play = video.play();
    if (play?.catch) {
      play.catch(() => {
        window.setTimeout(beginExit, 1200);
      });
    }

    return () => {
      video.removeEventListener('ended', onEnded);
      video.removeEventListener('loadeddata', onLoaded);
    };
  }, [phase, reduceMotion, beginExit]);

  useEffect(() => {
    if (phase === 'done') return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  useEffect(() => {
    if (phase === 'done') return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        skip();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, skip]);

  if (phase === 'done') return null;

  return (
    <motion.div
      className="fixed inset-0 z-[200] overflow-hidden bg-base"
      style={{ backgroundColor: '#0A0B0E' }}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction video. Press Escape or Skip to enter."
      initial={false}
      animate={{ opacity: phase === 'fade' ? 0 : 1 }}
      transition={{ duration: FADE_MS / 1000, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="intro-signal-video absolute inset-0 h-full w-full object-cover"
          src={GOJO_VIDEO_SRC}
          muted
          playsInline
          preload="auto"
          aria-label="Cinematic intro sequence"
        />
        <div className="intro-signal-tint absolute inset-0" aria-hidden="true" />
        <div className="intro-signal-vignette absolute inset-0" aria-hidden="true" />
        {!videoReady && phase === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center bg-base">
            <div className="h-10 w-10 animate-pulse rounded-full border-2 border-accent/40 border-t-accent" />
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-4 sm:p-6">
        <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent-bright/80 sm:text-xs">
          SIGNAL // WAKE
        </span>
        <button
          type="button"
          onClick={skip}
          className="pointer-events-auto min-h-11 cursor-pointer rounded-lg border border-line-subtle bg-surface/70 px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-ink-secondary backdrop-blur-md transition-colors duration-200 hover:border-accent/40 hover:text-accent-bright focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          Skip →
        </button>
      </div>

      {phase === 'video' && (
        <motion.p
          className="pointer-events-none absolute inset-x-0 bottom-8 z-30 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-ink-muted sm:text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6 }}
        >
          Domain expanding…
        </motion.p>
      )}
    </motion.div>
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
