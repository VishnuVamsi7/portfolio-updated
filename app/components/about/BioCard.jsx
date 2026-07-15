'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { springSmooth } from '../../lib/motion';

/**
 * Syntax-highlighted JSON payload split into color-coded tokens.
 * `k` = key, `s` = string value, `p` = punctuation / structure.
 */
const JSON_TOKENS = [
  ['{', 'p'], ['\n', 'p'],
  ['  ', 'p'], ['"role"', 'k'], [': ', 'p'], ['"AI Developer · Zibtek"', 's'], [',\n', 'p'],
  ['  ', 'p'], ['"location"', 'k'], [': ', 'p'], ['"Houston, TX"', 's'], [',\n', 'p'],
  ['  ', 'p'], ['"stack"', 'k'], [': ', 'p'], ['[', 'p'],
  ['"RAG"', 's'], [', ', 'p'], ['"Groq"', 's'], [', ', 'p'], ['"TensorFlow"', 's'], [', ', 'p'],
  ['"Docker"', 's'], [', ', 'p'], ['"FastAPI"', 's'], [']', 'p'], [',\n', 'p'],
  ['  ', 'p'], ['"focus"', 'k'], [': ', 'p'], ['"Production RAG Chatbots & LLM APIs"', 's'], ['\n', 'p'],
  ['}', 'p'],
];

const TOKEN_COLOR = {
  k: '#A78BFA', // accent-bright — keys
  s: '#6EE7B7', // teal — string values
  p: '#6B7280', // ink-muted — punctuation
};

const FULL_JSON_LENGTH = JSON_TOKENS.reduce((sum, [text]) => sum + text.length, 0);
const SCRAMBLE_GLYPHS = '01<>{}[]/\\|=+*#@%&$ABCDEF0123456789';

/** Render tokens up to `count` visible characters, preserving syntax colors. */
function renderTokens(count) {
  const out = [];
  let seen = 0;
  for (let i = 0; i < JSON_TOKENS.length; i += 1) {
    const [text, kind] = JSON_TOKENS[i];
    if (seen >= count) break;
    const remaining = count - seen;
    const slice = remaining >= text.length ? text : text.slice(0, remaining);
    out.push(
      <span key={i} style={{ color: TOKEN_COLOR[kind] }}>
        {slice}
      </span>
    );
    seen += text.length;
  }
  return out;
}

function ScrambleBlock() {
  const [rows, setRows] = useState(() => Array(6).fill(''));

  useEffect(() => {
    const randomRow = (len) =>
      Array.from({ length: len }, () =>
        SCRAMBLE_GLYPHS[Math.floor(Math.random() * SCRAMBLE_GLYPHS.length)]
      ).join('');
    const tick = () =>
      setRows([randomRow(10), randomRow(24), randomRow(20), randomRow(28), randomRow(16), randomRow(6)]);
    tick();
    const id = setInterval(tick, 45);
    return () => clearInterval(id);
  }, []);

  return (
    <pre
      aria-hidden="true"
      className="whitespace-pre-wrap break-all font-mono text-sm leading-relaxed text-accent/70"
    >
      {rows.join('\n')}
    </pre>
  );
}

export default function BioCard() {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef(null);
  const [isMachine, setIsMachine] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [phase, setPhase] = useState('human'); // 'human' | 'scramble' | 'type'
  const [typed, setTyped] = useState(0);

  // --- Depth-of-field tilt ---------------------------------------------------
  const px = useMotionValue(0.5); // normalized 0..1 across width
  const py = useMotionValue(0.5); // normalized 0..1 across height
  const gx = useMotionValue(0); // pixel cursor x within card
  const gy = useMotionValue(0); // pixel cursor y within card

  const rotateX = useSpring(useTransform(py, [0, 1], [7, -7]), { stiffness: 150, damping: 18 });
  const rotateY = useSpring(useTransform(px, [0, 1], [-7, 7]), { stiffness: 150, damping: 18 });

  // --- Edge glare (border) tracking cursor ----------------------------------
  const borderGlare = useMotionTemplate`radial-gradient(220px circle at ${gx}px ${gy}px, rgba(167,139,250,0.85), rgba(139,92,246,0.28) 42%, transparent 72%)`;
  const fillGlare = useMotionTemplate`radial-gradient(340px circle at ${gx}px ${gy}px, rgba(139,92,246,0.16), transparent 70%)`;

  const handleMove = useCallback(
    (e) => {
      if (reduceMotion || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const localX = e.clientX - rect.left;
      const localY = e.clientY - rect.top;
      px.set(localX / rect.width);
      py.set(localY / rect.height);
      gx.set(localX);
      gy.set(localY);
    },
    [reduceMotion, px, py, gx, gy]
  );

  const handleLeave = useCallback(() => {
    setIsHovered(false);
    px.set(0.5);
    py.set(0.5);
  }, [px, py]);

  // --- Human / Machine state machine ----------------------------------------
  const toggle = useCallback(() => {
    setIsMachine((prev) => {
      const next = !prev;
      if (next) {
        if (reduceMotion) {
          setPhase('type');
          setTyped(FULL_JSON_LENGTH);
        } else {
          setPhase('scramble');
          setTyped(0);
        }
      } else {
        setPhase('human');
      }
      return next;
    });
  }, [reduceMotion]);

  // Scramble → type transition
  useEffect(() => {
    if (phase !== 'scramble') return undefined;
    const id = setTimeout(() => {
      setTyped(0);
      setPhase('type');
    }, 420);
    return () => clearTimeout(id);
  }, [phase]);

  // Typewriter reveal
  useEffect(() => {
    if (phase !== 'type' || reduceMotion) return undefined;
    if (typed >= FULL_JSON_LENGTH) return undefined;
    const id = setTimeout(() => {
      setTyped((c) => Math.min(c + 2, FULL_JSON_LENGTH));
    }, 14);
    return () => clearTimeout(id);
  }, [phase, typed, reduceMotion]);

  const isTyping = phase === 'type' && typed < FULL_JSON_LENGTH;

  return (
    <div style={{ perspective: 1200 }}>
      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleLeave}
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="glass relative overflow-hidden rounded-2xl p-8 md:p-10"
      >
        {/* Fill glare */}
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl mix-blend-screen"
            style={{ background: fillGlare }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />
        )}
        {/* Border glare (masked ring) */}
        {!reduceMotion && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              background: borderGlare,
              padding: '1.5px',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.25 }}
          />
        )}

        <div className="relative" style={reduceMotion ? undefined : { transform: 'translateZ(40px)' }}>
          {/* Header + toggle */}
          <div className="mb-6 flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-accent-dim text-accent-bright shadow-glow-sm">
                <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7" aria-hidden="true">
                  <path
                    d="M12 3a4 4 0 0 0-4 4v1a4 4 0 0 0 8 0V7a4 4 0 0 0-4-4Z"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M5 20a7 7 0 0 1 14 0"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="7" r="1" fill="currentColor" />
                </svg>
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold text-ink-primary md:text-3xl">
                  Sai Vishnu Vamsi
                </h3>
                <p className="font-medium text-ink-secondary">AI Developer · Zibtek</p>
              </div>
            </div>

            <ModeToggle isMachine={isMachine} onToggle={toggle} reduceMotion={reduceMotion} />
          </div>

          {/* State-swapped content — fixed min-height for layout stability */}
          <div className="relative min-h-[228px]">
            <AnimatePresence mode="wait" initial={false}>
              {!isMachine ? (
                <motion.div
                  key="human"
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
                  transition={springSmooth}
                  className="space-y-4 leading-relaxed text-ink-secondary"
                >
                  <p className="text-lg text-ink-primary/90">
                    Sai Vishnu Vamsi Senagasetty is an AI Developer at Zibtek (Houston, Texas) who turns
                    early chatbot prototypes into production RAG systems—with retrieval, policy routing,
                    citations, lead capture, and LLM APIs.
                  </p>
                  <p className="text-lg">
                    Outside client work he ships fast: TwinMind (Whisper + Groq agent), AlphaBot trading,
                    ResumeLLM, AutoDoc-AI, e-commerce RAG, Flutter apps, and research in NLP, CV, and model serving.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key="machine"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-xl border border-line-subtle bg-base/70 p-4"
                >
                  <div className="mb-3 flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                    <span className="ml-2 font-mono text-xs uppercase tracking-wider text-ink-muted">
                      profile.json
                    </span>
                  </div>
                  {phase === 'scramble' ? (
                    <ScrambleBlock />
                  ) : (
                    <pre className="whitespace-pre-wrap break-words font-mono text-sm leading-relaxed">
                      {renderTokens(typed)}
                      {isTyping && (
                        <motion.span
                          aria-hidden="true"
                          className="ml-0.5 inline-block h-4 w-2 translate-y-0.5 bg-accent-bright"
                          animate={{ opacity: [1, 0.2, 1] }}
                          transition={{ duration: 0.7, repeat: Infinity }}
                        />
                      )}
                    </pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function ModeToggle({ isMachine, onToggle, reduceMotion }) {
  const knobTransition = reduceMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 320, damping: 26 };

  const Segment = ({ active, children }) => (
    <span className="relative rounded-full px-2.5 py-1">
      {active && (
        <motion.span
          layoutId="bio-mode-knob"
          aria-hidden="true"
          className="absolute inset-0 rounded-full bg-gradient-to-r from-accent to-accent-bright shadow-glow-sm"
          transition={knobTransition}
        />
      )}
      <span className={`relative z-10 transition-colors duration-200 ${active ? 'text-base' : 'text-ink-muted'}`}>
        {children}
      </span>
    </span>
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isMachine}
      aria-label={isMachine ? 'Switch to human-readable bio' : 'Switch to machine-readable JSON'}
      onClick={onToggle}
      data-cursor="pointer"
      className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full border border-line-subtle bg-base/60 p-1 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-200 hover:border-line-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      <Segment active={!isMachine}>Human</Segment>
      <Segment active={isMachine}>Machine</Segment>
    </button>
  );
}
