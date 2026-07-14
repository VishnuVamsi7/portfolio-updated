'use client';

import { useRef } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useAnimationControls,
  useReducedMotion,
} from 'framer-motion';

const EDUCATION = [
  {
    id: 'ms',
    degree: 'MS Computer Science',
    school: 'University of Houston',
    years: '2023 – 2025',
    x: 24,
    y: 16,
  },
  {
    id: 'bt',
    degree: 'BTech Computer Science',
    school: 'SRM University, AP',
    years: '2019 – 2023',
    x: 24,
    y: 66,
  },
];

// Skill nodes branch out from the education spine. `from` = source education index.
const SKILLS = [
  { id: 'rag', label: 'RAG', x: 58, y: 10, from: 0 },
  { id: 'llm', label: 'LLM Deployment', x: 74, y: 26, from: 0 },
  { id: 'py', label: 'Python', x: 62, y: 54, from: 1 },
  { id: 'agents', label: 'Multi-Agent', x: 80, y: 66, from: 1 },
  { id: 'vision', label: 'Computer Vision', x: 56, y: 82, from: 1 },
];

export default function NeuralPipeline() {
  const reduceMotion = useReducedMotion();
  const sectionRef = useRef(null);
  const stageRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 0.85', 'end 0.55'],
  });

  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  // Spine draws as you scroll; branches follow slightly behind.
  const spineLength = reduceMotion ? 1 : smooth;
  const branchLength = useTransform(smooth, [0.35, 1], [0, 1]);
  // Second education node lights up once the pulse reaches it.
  const node2Opacity = useTransform(smooth, [0.55, 0.9], [0.35, 1]);
  const node2Glow = useTransform(smooth, [0.55, 0.9], [0, 1]);

  return (
    <div ref={sectionRef}>
      <div
        ref={stageRef}
        className="relative mx-auto h-[560px] w-full max-w-2xl md:h-[600px]"
      >
        {/* Connective tissue */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="pipeline-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#A78BFA" />
              <stop offset="100%" stopColor="#7C3AED" />
            </linearGradient>
            <filter id="pipeline-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="1.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base spine (dim) */}
          <path
            d={`M ${EDUCATION[0].x} ${EDUCATION[0].y} L ${EDUCATION[1].x} ${EDUCATION[1].y}`}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
          />
          {/* Animated spine pulse */}
          <motion.path
            d={`M ${EDUCATION[0].x} ${EDUCATION[0].y} L ${EDUCATION[1].x} ${EDUCATION[1].y}`}
            fill="none"
            stroke="url(#pipeline-grad)"
            strokeWidth="2.5"
            vectorEffect="non-scaling-stroke"
            strokeLinecap="round"
            filter="url(#pipeline-glow)"
            style={{ pathLength: spineLength }}
          />

          {/* Branch connectors to skill nodes */}
          {SKILLS.map((s) => {
            const src = EDUCATION[s.from];
            return (
              <g key={s.id}>
                <path
                  d={`M ${src.x} ${src.y} L ${s.x} ${s.y}`}
                  fill="none"
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                />
                <motion.path
                  d={`M ${src.x} ${src.y} L ${s.x} ${s.y}`}
                  fill="none"
                  stroke="rgba(139,92,246,0.55)"
                  strokeWidth="1.5"
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                  style={{ pathLength: reduceMotion ? 1 : branchLength }}
                />
              </g>
            );
          })}
        </svg>

        {/* Education nodes */}
        <EducationNode data={EDUCATION[0]} reduceMotion={reduceMotion} lit />
        <EducationNode
          data={EDUCATION[1]}
          reduceMotion={reduceMotion}
          litStyle={reduceMotion ? undefined : { opacity: node2Opacity }}
          glow={reduceMotion ? 1 : node2Glow}
        />

        {/* Draggable skill constellation */}
        {SKILLS.map((s, i) => (
          <SkillNode key={s.id} data={s} index={i} constraintsRef={stageRef} reduceMotion={reduceMotion} />
        ))}
      </div>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Drag the skill nodes — they snap back with spring physics.
      </p>
    </div>
  );
}

function EducationNode({ data, reduceMotion, lit, litStyle, glow }) {
  return (
    <motion.div
      className="absolute z-10 w-56 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${data.x}%`, top: `${data.y}%`, ...(litStyle || {}) }}
      initial={reduceMotion ? false : { opacity: lit ? 1 : undefined, scale: 0.94 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ type: 'spring', stiffness: 160, damping: 20 }}
    >
      <div className="glass glass-glow relative rounded-xl p-4">
        <motion.span
          aria-hidden="true"
          className="absolute -left-1.5 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent-bright shadow-glow-sm"
          style={glow !== undefined ? { opacity: glow } : undefined}
        />
        <p className="font-display text-base font-bold text-ink-primary">{data.degree}</p>
        <p className="text-sm text-accent-bright">{data.school}</p>
        <p className="mt-1 text-xs text-ink-muted">{data.years}</p>
      </div>
    </motion.div>
  );
}

function SkillNode({ data, index, constraintsRef, reduceMotion }) {
  const controls = useAnimationControls();

  const handleDragEnd = () => {
    controls.start({
      x: 0,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    });
  };

  return (
    <motion.button
      type="button"
      drag={!reduceMotion}
      dragConstraints={constraintsRef}
      dragElastic={0.55}
      dragMomentum={false}
      onDragEnd={handleDragEnd}
      animate={controls}
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      whileDrag={{ scale: 1.14, zIndex: 30, cursor: 'grabbing' }}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 16, delay: 0.2 + index * 0.08 }}
      style={{ left: `${data.x}%`, top: `${data.y}%` }}
      data-cursor="pointer"
      aria-label={`${data.label} skill node — draggable`}
      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 cursor-grab touch-none select-none whitespace-nowrap rounded-full border border-accent/40 bg-surface-elevated/90 px-3.5 py-1.5 text-sm font-semibold text-ink-primary shadow-glass backdrop-blur-md transition-colors duration-200 hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent active:cursor-grabbing"
    >
      <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-accent-bright align-middle" />
      {data.label}
    </motion.button>
  );
}
