'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { TIMELINE_SECTIONS } from '../../lib/companionSections';

const SVG_WIDTH = 28;
const TRACK_HEIGHT = 420;
const NODE_X = SVG_WIDTH / 2;
const NODE_SPRING = { type: 'spring', stiffness: 420, damping: 13, mass: 0.7 };

/**
 * Fixed vertical narrative timeline (right edge).
 * The line "draws" via stroke-dashoffset bound to scrollYProgress;
 * nodes pop in with a bouncy spring as progress crosses them.
 */
export default function ScrollTimeline() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.4 });
  const dashOffset = useTransform(smooth, [0, 1], [TRACK_HEIGHT, 0]);

  const [nodes, setNodes] = useState([]);
  const [reached, setReached] = useState(() => TIMELINE_SECTIONS.map(() => false));
  const [activeIdx, setActiveIdx] = useState(0);

  // Map each section's document position → fraction along the track
  const measure = useCallback(() => {
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;

    const next = TIMELINE_SECTIONS.map((s) => {
      const el = document.getElementById(s.id);
      if (!el) return null;
      const top = el.getBoundingClientRect().top + window.scrollY;
      const fraction = Math.min(1, Math.max(0, (top - window.innerHeight * 0.35) / scrollable));
      return { ...s, fraction };
    }).filter(Boolean);

    setNodes(next);
  }, []);

  useEffect(() => {
    measure();
    // Re-measure after images/fonts settle and on resize
    const t = setTimeout(measure, 800);
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  useMotionValueEvent(smooth, 'change', (v) => {
    if (!nodes.length) return;
    let active = 0;
    setReached((prev) => {
      let changed = false;
      const next = nodes.map((n, i) => {
        const hit = v >= n.fraction - 0.005;
        if (hit) active = i;
        if (hit !== prev[i]) changed = true;
        return hit;
      });
      setActiveIdx(active);
      return changed ? next : prev;
    });
  });

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <nav
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block"
      aria-label="Section timeline"
    >
      <svg
        width={SVG_WIDTH}
        height={TRACK_HEIGHT}
        viewBox={`0 0 ${SVG_WIDTH} ${TRACK_HEIGHT}`}
        fill="none"
        className="overflow-visible"
      >
        {/* Track */}
        <line
          x1={NODE_X}
          y1="0"
          x2={NODE_X}
          y2={TRACK_HEIGHT}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="2"
        />

        {/* Progress line — draws with scroll */}
        <motion.line
          x1={NODE_X}
          y1="0"
          x2={NODE_X}
          y2={TRACK_HEIGHT}
          stroke="url(#timeline-gradient)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={TRACK_HEIGHT}
          style={{ strokeDashoffset: reduceMotion ? 0 : dashOffset }}
        />

        <defs>
          <linearGradient id="timeline-gradient" x1="0" y1="0" x2="0" y2={TRACK_HEIGHT} gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#7C3AED" />
            <stop offset="1" stopColor="#A78BFA" />
          </linearGradient>
        </defs>

        {/* Section nodes */}
        {nodes.map((node, i) => {
          const cy = node.fraction * TRACK_HEIGHT;
          const isActive = i === activeIdx;
          return (
            <g key={node.id}>
              {/* Generous hit area */}
              <circle
                cx={NODE_X}
                cy={cy}
                r="14"
                fill="transparent"
                className="pointer-events-auto cursor-pointer"
                onClick={() => scrollToSection(node.id)}
                role="link"
                tabIndex={0}
                aria-label={`Jump to ${node.label}`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToSection(node.id);
                  }
                }}
              />
              <motion.circle
                cx={NODE_X}
                cy={cy}
                r={isActive ? 5.5 : 4}
                fill={reached[i] ? '#8B5CF6' : '#14161B'}
                stroke={reached[i] ? '#A78BFA' : 'rgba(255,255,255,0.15)'}
                strokeWidth="1.5"
                initial={false}
                animate={{
                  scale: reduceMotion ? 1 : reached[i] ? 1 : 0,
                  opacity: reached[i] ? 1 : 0.55,
                }}
                transition={reduceMotion ? { duration: 0 } : NODE_SPRING}
                style={{ transformOrigin: `${NODE_X}px ${cy}px`, pointerEvents: 'none' }}
              />
              {isActive && !reduceMotion && (
                <motion.circle
                  cx={NODE_X}
                  cy={cy}
                  r="9"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="1"
                  initial={{ opacity: 0.6, scale: 0.6 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
                  style={{ transformOrigin: `${NODE_X}px ${cy}px`, pointerEvents: 'none' }}
                />
              )}
            </g>
          );
        })}
      </svg>

      {/* Active label */}
      <div className="pointer-events-none absolute -left-2 top-full mt-3 w-24 -translate-x-full text-right">
        <motion.span
          key={nodes[activeIdx]?.id}
          className="text-[10px] font-semibold uppercase tracking-widest text-accent-bright"
          initial={reduceMotion ? false : { opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {nodes[activeIdx]?.label}
        </motion.span>
      </div>
    </nav>
  );
}
