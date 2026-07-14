'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const JSON_TOKENS = [
  ['{', 'p'], ['\n', 'p'],
  ['  ', 'p'], ['"role"', 'k'], [': ', 'p'], ['"AI/ML Engineer"', 's'], [',\n', 'p'],
  ['  ', 'p'], ['"location"', 'k'], [': ', 'p'], ['"Houston, TX"', 's'], [',\n', 'p'],
  ['  ', 'p'], ['"stack"', 'k'], [': ', 'p'], ['[', 'p'],
  ['"RAG"', 's'], [', ', 'p'], ['"Groq"', 's'], [', ', 'p'], ['"TensorFlow"', 's'], [', ', 'p'],
  ['"Docker"', 's'], [', ', 'p'], ['"FastAPI"', 's'], [']', 'p'], [',\n', 'p'],
  ['  ', 'p'], ['"focus"', 'k'], [': ', 'p'], ['"Autonomous Multi-Agent Systems"', 's'], ['\n', 'p'],
  ['}', 'p'],
];

const TOKEN_COLOR = {
  k: '#A78BFA',
  s: '#6EE7B7',
  p: '#6B7280',
};

const FULL_JSON_LENGTH = JSON_TOKENS.reduce((sum, [text]) => sum + text.length, 0);
const SCRAMBLE_GLYPHS = '01<>{}[]/\\|=+*#@%&$ABCDEF0123456789';

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

export default function MachineBio({ reduceMotion }) {
  const [phase, setPhase] = useState(() => (reduceMotion ? 'type' : 'scramble'));
  const [typed, setTyped] = useState(() => (reduceMotion ? FULL_JSON_LENGTH : 0));

  useEffect(() => {
    if (phase !== 'scramble') return undefined;
    const id = setTimeout(() => {
      setTyped(0);
      setPhase('type');
    }, 420);
    return () => clearTimeout(id);
  }, [phase]);

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
    <div className="rounded-xl border border-line-subtle bg-base/70 p-4">
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
    </div>
  );
}
