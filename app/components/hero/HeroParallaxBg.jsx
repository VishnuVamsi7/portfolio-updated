'use client';

import { motion, useTransform } from 'framer-motion';

const SILHOUETTE_SRC = '/assets/silhouette-transparent.webp?v=3';

/**
 * CSS parallax silhouette — slower than scroll, outside WebGL to keep GPU cost low.
 *
 * @param {{ progress: import('framer-motion').MotionValue<number>, reduceMotion?: boolean }} props
 */
export default function HeroParallaxBg({ progress, reduceMotion = false }) {
  const y = useTransform(progress, [0, 1], reduceMotion ? [0, 0] : [0, 110]);
  const opacity = useTransform(
    progress,
    [0, 0.55, 1],
    reduceMotion ? [0.35, 0.35, 0.35] : [0.42, 0.28, 0.08],
  );
  const scale = useTransform(progress, [0, 1], reduceMotion ? [1, 1] : [1.04, 0.9]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 34%, rgba(139,92,246,0.18), transparent 38%), radial-gradient(circle at 12% 78%, rgba(124,58,237,0.09), transparent 34%), linear-gradient(180deg, #0A0B0E 0%, #0D0E12 58%, #0A0B0E 100%)',
        }}
      />
      <motion.div
        className="absolute left-1/2 top-[6%] h-[min(70vh,620px)] w-[min(92vw,500px)] -translate-x-1/2"
        style={{ y, opacity, scale }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={SILHOUETTE_SRC}
          alt=""
          decoding="async"
          fetchPriority="low"
          className="h-full w-full object-contain object-top"
          style={{
            filter: 'drop-shadow(0 0 48px rgba(139,92,246,0.22))',
          }}
        />
      </motion.div>
    </div>
  );
}
