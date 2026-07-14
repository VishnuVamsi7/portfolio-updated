'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import HeroRobotSkeleton from './HeroRobotSkeleton';

const SPLINE_SCENE =
  process.env.NEXT_PUBLIC_SPLINE_SCENE_URL ||
  'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode';

/**
 * OPTION A — Spline embed
 *
 * Setup:
 * 1. npm install @splinetool/react-spline @splinetool/runtime
 * 2. Export your scene from Spline → copy the public .splinecode URL
 * 3. Set NEXT_PUBLIC_SPLINE_SCENE_URL in .env
 * 4. Set NEXT_PUBLIC_HERO_ROBOT=spline
 *
 * Bundle: ~200–400 KB for runtime (lazy-loaded). Scene file loads separately (~1–5 MB).
 *
 * Spline variables (create in Spline editor → Variables):
 * - lookX, lookY (numbers) — drive head/mouse-follow in your scene graph
 * - react (number) — pulse on click for wave/bounce state machine
 */
export default function HeroRobotSpline() {
  const reduceMotion = useReducedMotion();
  const SplineComponentRef = useRef(null);
  const appRef = useRef(null);
  const [SplineComponent, setSplineComponent] = useState(null);
  const [loadError, setLoadError] = useState(false);
  const reactTimeoutRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    import('@splinetool/react-spline')
      .then((mod) => {
        if (!cancelled) setSplineComponent(() => mod.default);
      })
      .catch(() => setLoadError(true));
    return () => {
      cancelled = true;
    };
  }, []);

  const onLoad = useCallback(
    (app) => {
      appRef.current = app;
      if (reduceMotion) {
        try {
          app.setVariable('lookX', 0);
          app.setVariable('lookY', 0);
        } catch {
          /* scene may not define variables yet */
        }
      }
    },
    [reduceMotion]
  );

  useEffect(() => {
    if (reduceMotion || loadError) return;

    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    if (isTouch) return;

    const onMove = (e) => {
      const app = appRef.current;
      if (!app) return;
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      try {
        app.setVariable('lookX', nx);
        app.setVariable('lookY', -ny);
      } catch {
        /* optional variables */
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduceMotion, loadError]);

  const onClick = useCallback(() => {
    const app = appRef.current;
    if (!app || reduceMotion) return;
    try {
      app.setVariable('react', 1);
      if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
      reactTimeoutRef.current = setTimeout(() => {
        try {
          app.setVariable('react', 0);
        } catch {
          /* ignore */
        }
      }, 900);
    } catch {
      /* ignore */
    }
  }, [reduceMotion]);

  useEffect(
    () => () => {
      if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
    },
    []
  );

  if (loadError) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-xl border border-dashed border-line-subtle bg-surface/30 px-2 text-center text-[10px] text-ink-muted">
        Spline failed to load. Set NEXT_PUBLIC_SPLINE_SCENE_URL or use r3f mode.
      </div>
    );
  }

  if (!SplineComponent) {
    return <HeroRobotSkeleton />;
  }

  if (reduceMotion) {
    return (
      <div className="flex h-full w-full items-center justify-center opacity-90">
        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-accent-dim to-accent shadow-glow-sm sm:h-20 sm:w-20" />
      </div>
    );
  }

  return (
    <div className="h-full w-full cursor-pointer overflow-hidden rounded-xl" onClick={onClick} role="presentation">
      <SplineComponent scene={SPLINE_SCENE} onLoad={onLoad} className="h-full w-full" />
    </div>
  );
}
