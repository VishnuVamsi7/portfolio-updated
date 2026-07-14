'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { springSnappy } from '../../lib/motion';

export default function MagneticButton({ children, className = '', onClick, type = 'button', ...props }) {
  const ref = useRef(null);
  const reduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 240, damping: 22 });
  const springY = useSpring(y, { stiffness: 240, damping: 22 });

  const handleMove = (e) => {
    if (reduceMotion || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.22);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.22);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={ref}
      type={type}
      className={`shine-sweep btn-primary ${className}`}
      style={reduceMotion ? undefined : { x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={reset}
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      animate={reduceMotion ? undefined : { scale: isHovered ? 1.03 : 1 }}
      transition={springSnappy}
      onClick={onClick}
      data-cursor="pointer"
      {...props}
    >
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}
