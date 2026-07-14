'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroInkBackground() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.5]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity: overlayOpacity }}
      className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
      aria-hidden="true"
    >
      {/* Light vignette only — plasma shader stays visible underneath */}
      <div className="absolute inset-0 bg-gradient-to-b from-base/25 via-transparent to-base/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,transparent_0%,rgba(10,11,14,0.45)_80%)]" />
      <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(10,11,14,0.35)]" />
    </motion.div>
  );
}
