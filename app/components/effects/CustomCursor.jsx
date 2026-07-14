'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

export default function CustomCursor() {
  const [isTouch, setIsTouch] = useState(true);
  const [isHovering, setIsHovering] = useState(false);
  const reduceMotion = useReducedMotion();

  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useSpring(cursorX, { stiffness: 220, damping: 26 });
  const ringY = useSpring(cursorY, { stiffness: 220, damping: 26 });

  useEffect(() => {
    const touch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;
    setIsTouch(touch);
    if (touch || reduceMotion) return;

    const move = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const onOver = (e) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      setIsHovering(!!target.closest('a, button, [data-cursor="pointer"], input, textarea'));
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseover', onOver);
    document.body.classList.add('custom-cursor-active');

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseover', onOver);
      document.body.classList.remove('custom-cursor-active');
    };
  }, [cursorX, cursorY, reduceMotion]);

  if (isTouch || reduceMotion) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent mix-blend-screen"
        style={{ x: cursorX, y: cursorY }}
        animate={{ scale: isHovering ? 0.5 : 1 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/60"
        style={{ x: ringX, y: ringY }}
        animate={{
          width: isHovering ? 44 : 28,
          height: isHovering ? 44 : 28,
          boxShadow: isHovering ? '0 0 24px rgba(139,92,246,0.45)' : '0 0 12px rgba(139,92,246,0.2)',
        }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      />
    </>
  );
}
