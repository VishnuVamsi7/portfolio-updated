'use client';

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import TechLogoArc, { INTRO_TECH_STACK } from './TechLogoArc';

const SESSION_KEY = 'introPlayed';
const EXIT_MS = 0.55;
const DISMISS_DISTANCE = () =>
  typeof window !== 'undefined' ? Math.min(220, window.innerHeight * 0.28) : 180;
const DISMISS_VELOCITY = -650;
const SILHOUETTE_SRC = '/assets/silhouette-transparent.webp?v=3';

function paintBootSilhouette(root) {
  const canvas = root?.querySelector('canvas.intro-boot-image');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  const image = new window.Image();
  image.decoding = 'async';
  const draw = () => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  image.addEventListener('load', draw, { once: true });
  image.src = SILHOUETTE_SRC;
  if (image.complete) draw();
}

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

function SlideUpHint({ visible }) {
  if (!visible) return null;
  return (
    <div className="intro-hint pointer-events-none absolute inset-x-0 bottom-8 z-40 flex flex-col items-center justify-center gap-2 sm:bottom-10">
      <p className="w-full text-center font-mono text-[10px] uppercase tracking-[0.28em] text-ink-secondary sm:text-xs">
        Slide up to enter
      </p>
      <div
        className="intro-hint-arrow flex h-10 w-10 items-center justify-center rounded-full border border-accent/40 bg-surface/70 text-accent-bright shadow-glow-sm backdrop-blur-md"
        aria-hidden="true"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M12 19V5M5 12l7-7 7 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="mt-1 h-1 w-10 rounded-full bg-ink-muted/40" aria-hidden="true" />
    </div>
  );
}

/**
 * One-time (per session) landing intro. Stays until the user slides the panel
 * upward (drag / swipe) — no auto-dismiss timer.
 * Parent only mounts this when the intro should play.
 */
export default function LandingIntro({ onExitStart, onComplete }) {
  const reduceMotion = usePrefersReducedMotion();
  const arcRadius = useArcRadius();
  const introRef = useRef(null);
  const pointerRef = useRef(null);
  // Start in play immediately — never leave a gap where the main page shows through.
  const [phase, setPhase] = useState('play'); // play | exit | done
  const [logoReady, setLogoReady] = useState(false);
  const [hintReady, setHintReady] = useState(false);
  const [dragY, setDragY] = useState(0);
  const [dragging, setDragging] = useState(false);

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
    if (phase !== 'play') return;
    setDragging(false);
    onExitStart?.();
    setPhase('exit');
  }, [phase, onExitStart]);

  useLayoutEffect(() => {
    if (reduceMotion) {
      finish();
      return undefined;
    }

    // Reuse the server-painted art inside the draggable panel. Keeping the
    // same DOM image avoids replacing the early LCP candidate after hydration.
    const bootArt = document.getElementById('intro-boot-scrim');
    if (bootArt && introRef.current) {
      paintBootSilhouette(bootArt);
      bootArt.classList.add('intro-boot-art');
      introRef.current.prepend(bootArt);
    }
    return undefined;
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
    const hintTimer = window.setTimeout(() => setHintReady(true), 2400);

    return () => {
      window.clearTimeout(logoTimer);
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

  const handlePointerDown = useCallback((event) => {
    if (phase !== 'play' || event.button > 0) return;
    const now = performance.now();
    pointerRef.current = {
      id: event.pointerId,
      startY: event.clientY,
      lastY: event.clientY,
      lastTime: now,
      velocity: 0,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
  }, [phase]);

  const handlePointerMove = useCallback((event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    const now = performance.now();
    const elapsed = Math.max(1, now - pointer.lastTime);
    pointer.velocity = ((event.clientY - pointer.lastY) / elapsed) * 1000;
    pointer.lastY = event.clientY;
    pointer.lastTime = now;
    setDragY(Math.min(0, event.clientY - pointer.startY));
  }, []);

  const handlePointerEnd = useCallback((event) => {
    const pointer = pointerRef.current;
    if (!pointer || pointer.id !== event.pointerId) return;
    pointerRef.current = null;
    setDragging(false);

    if (dragY <= -DISMISS_DISTANCE() || pointer.velocity <= DISMISS_VELOCITY) {
      triggerExit();
      return;
    }
    setDragY(0);
  }, [dragY, triggerExit]);

  if (phase === 'done') return null;

  return (
    <div
      ref={introRef}
      className="fixed inset-0 z-[200] flex touch-none flex-col items-center justify-center overflow-hidden bg-base"
      style={{
        backgroundColor: '#0A0B0E',
        transform:
          phase === 'exit'
            ? 'translate3d(0, -105%, 0)'
            : `translate3d(0, ${dragY}px, 0)`,
        opacity:
          phase === 'play'
            ? Math.max(0.4, 1 - Math.min(1, Math.abs(dragY) / 180) * 0.6)
            : 1,
        transition:
          phase === 'exit'
            ? `transform ${EXIT_MS}s ease-in-out`
            : dragging
              ? 'none'
              : 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 200ms ease',
        willChange: dragging || phase === 'exit' ? 'transform' : 'auto',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Portfolio introduction. Slide up to enter the site."
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onTransitionEnd={(event) => {
        if (phase === 'exit' && event.propertyName === 'transform') finish();
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
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
              {logoReady && (
                <TechLogoArc
                  logos={INTRO_TECH_STACK}
                  radius={arcRadius}
                  startAngle={-155}
                  endAngle={-25}
                />
              )}
            </div>

          </div>

      <SlideUpHint visible={hintReady && phase === 'play'} />
    </div>
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
