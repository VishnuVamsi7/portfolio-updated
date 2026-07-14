'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { springSmooth } from '../../lib/motion';

export default function SkillCard({ children, index = 0 }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const springRotateX = useSpring(rotateX, { stiffness: 220, damping: 26 });
  const springRotateY = useSpring(rotateY, { stiffness: 220, damping: 26 });

  const handleMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    rotateX.set(-((e.clientY - rect.top) / rect.height - 0.5) * 10);
    rotateY.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
  };

  return (
    <motion.div
      ref={ref}
      className="glass glass-hover rounded-2xl p-6"
      style={
        reduceMotion
          ? undefined
          : { transformStyle: 'preserve-3d', perspective: 800, rotateX: springRotateX, rotateY: springRotateY }
      }
      onMouseMove={handleMove}
      onMouseLeave={() => { rotateX.set(0); rotateY.set(0); }}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={reduceMotion ? undefined : { y: -6, boxShadow: '0 12px 40px rgba(0,0,0,0.55), 0 0 32px rgba(139,92,246,0.18)' }}
      transition={{ ...springSmooth, delay: index * 0.06 }}
    >
      {children}
    </motion.div>
  );
}
