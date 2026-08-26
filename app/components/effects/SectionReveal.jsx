'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { springSmooth } from '../../lib/motion';

/**
 * One-shot fade + rise on enter (default for text blocks).
 * Pass scrub for scroll-linked motion (project cards, connectors).
 *
 * @param {'once' | 'scrub'} [mode='once']
 * @param {number} [scrubDistance=56] px translate when scrubbing
 */
export default function SectionReveal({
  children,
  className = '',
  delay = 0,
  mode = 'once',
  scrubDistance = 56,
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scrubY = useTransform(
    scrollYProgress,
    [0, 0.35, 0.65, 1],
    reduceMotion || mode !== 'scrub' ? [0, 0, 0, 0] : [scrubDistance, 0, 0, -scrubDistance * 0.35],
  );
  const scrubOpacity = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    reduceMotion || mode !== 'scrub' ? [1, 1, 1, 1] : [0, 1, 1, 0.85],
  );

  if (reduceMotion) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  if (mode === 'scrub') {
    return (
      <motion.div ref={ref} className={className} style={{ y: scrubY, opacity: scrubOpacity }}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ ...springSmooth, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Soft crossfade bridge used at the top of the first below-fold section. */
export function HeroSectionBridge({ children, className = '' }) {
  const reduceMotion = useReducedMotion();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 40%'],
  });
  const opacity = useTransform(scrollYProgress, [0, 1], reduceMotion ? [1, 1] : [0.35, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, 0]);

  return (
    <motion.div ref={ref} className={className} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

export function StaggerReveal({ children, className = '' }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: 0.1 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 28 },
        show: { opacity: 1, y: 0, transition: springSmooth },
      }}
    >
      {children}
    </motion.div>
  );
}
