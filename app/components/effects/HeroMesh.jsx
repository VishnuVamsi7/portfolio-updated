'use client';

import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

export default function HeroMesh() {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  const blob1Y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 140]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : -100]);
  const blob3Y = useTransform(scrollYProgress, [0, 1], [0, reduceMotion ? 0 : 80]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.25]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden bg-base" aria-hidden="true">
      <div className="hero-mesh absolute inset-0 opacity-80" />

      <motion.div
        style={{ y: blob1Y, opacity }}
        className="animate-orb-drift absolute -left-20 top-10 h-[420px] w-[420px] rounded-full bg-accent/25 blur-[100px]"
      />
      <motion.div
        style={{ y: blob2Y, opacity }}
        className="animate-orb-drift absolute -right-16 top-32 h-[360px] w-[360px] rounded-full bg-accent-bright/15 blur-[90px]"
      />
      <motion.div
        style={{ y: blob3Y, opacity }}
        className="animate-orb-drift absolute bottom-0 left-1/3 h-[300px] w-[500px] rounded-full bg-accent-dim/20 blur-[110px]"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base/20 to-base" />
    </div>
  );
}
