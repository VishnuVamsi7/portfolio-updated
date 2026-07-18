'use client';

import { useMemo } from 'react';

/** Inline brand marks — no external icon CDN. */
const LOGO_MARKS = {
  Python: (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C7.6 2 7.3 4 7.3 4v2.2h4.8v.7H5.5S3 6.7 3 11.3c0 4.6 2 4.4 2 4.4h1.2V13.6s-.1-2.3 2.3-2.3h4c2.5 0 2.3 2.1 2.3 2.1v4.3s.2 2.4-2.3 2.4H8.4S6 22.3 6 19.3V17H3.8s-2.3.3-2.3 3.6C1.5 24 5.3 24 5.3 24H10s2.3.1 2.3-2.3v-2.2H7.8v-.7h6.9s2-.1 2-4.3c0-4.2-2-4.1-2-4.1H12.9V4.4s.2-2.4 2.3-2.4h4.2S22 2 22 5.5c0 3.5-2.1 3.4-2.1 3.4h-1.3v2.1s0 2.3-2.4 2.3H12.2S9.8 13.3 9.8 11c0-2.2 2-2.1 2-2.1h5.2V6.6s.3-4.6-4.9-4.6z"
      />
    </svg>
  ),
  TensorFlow: (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path fill="currentColor" d="M12 2 2.5 7.2v2.3L12 4.7l9.5 4.8V7.2L12 2zm0 5.5L7 10.2v4.1l2.2 1.1V12l2.8 1.5v6.8L12 22l.1-.1v-6.8L15 12v3.4l2.2-1.1v-4.1L12 7.5z" />
    </svg>
  ),
  PyTorch: (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12.1 2.1c-.4 0-.8.1-1.1.4L5.3 8.2c-2.4 2.4-2.4 6.3 0 8.7 2.3 2.3 6 2.4 8.4.3l.2-.2c2.4-2.4 2.4-6.4 0-8.8L10.5 4.7l1.1-1.1c.7-.7 1.8-.7 2.5 0 .7.7.7 1.8 0 2.5l-.4.4 1.2 1.2.4-.4c1.4-1.4 1.4-3.6 0-5-.7-.7-1.6-1.1-2.6-1.1l-.1-.1zm3.3 6.5c1.7 1.7 1.7 4.5 0 6.2-1.7 1.7-4.5 1.7-6.2 0-1.7-1.7-1.7-4.5 0-6.2 1.7-1.7 4.5-1.7 6.2 0zm-1.8 1.5a1.3 1.3 0 1 0 0 2.6 1.3 1.3 0 0 0 0-2.6z"
      />
    </svg>
  ),
  'Next.js': (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.6 0 3.1-.4 4.5-1L8.2 8.2v6.3H6.7V6.7h1.7l9.2 13c2.6-1.8 4.4-4.8 4.4-8.2C22 6.5 17.5 2 12 2zm3.2 11.5V6.7h1.5v9.5l-1.5-2.7z"
      />
    </svg>
  ),
  React: (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <circle cx="12" cy="12" r="2.2" fill="currentColor" />
      <g fill="none" stroke="currentColor" strokeWidth="1.4">
        <ellipse cx="12" cy="12" rx="9" ry="3.6" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" />
      </g>
    </svg>
  ),
  Docker: (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path
        fill="currentColor"
        d="M4.4 11h1.6v1.5H4.4V11zm2.1 0H8v1.5H6.5V11zm2.1 0h1.5v1.5H8.6V11zm2.1 0h1.5v1.5h-1.5V11zM6.5 8.8H8V10H6.5V8.8zm2.1 0h1.5V10H8.6V8.8zm2.1 0h1.5V10h-1.5V8.8zm0-2.2h1.5v1.5h-1.5V6.6zM4 14.3c-.2 0 2.2 2.5 6.5 2.5 4.8 0 8.4-2.2 9.5-5.4.6.1 1.9.1 2.8-1-.3.2-1.2.4-1.9.2.5-.3 1.3-1.2 1.5-1.9-.5.4-1.6.8-2.3.7C19.2 7.8 17.5 7 14.8 7c-.4 0-.7 0-1 .1V8.8H12V7.4c-.5.1-1 .3-1.4.5V10H9.1V8.2c-.7.5-1.2 1.1-1.5 1.9v1.4H5.9v-1c-.7.7-1.1 1.6-1.3 2.5H4c-.7 0-1.2.4-1.4.8z"
      />
    </svg>
  ),
  LangChain: (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path
        fill="currentColor"
        d="M7.5 4.5a3 3 0 0 0 0 6h2v-1.5h-2a1.5 1.5 0 1 1 0-3h4.2V4.5H7.5zm9 9a3 3 0 0 0 0-6h-2V9h2a1.5 1.5 0 1 1 0 3h-4.2v1.5H16.5zM9 10.5h6V12H9v-1.5zM7.5 13.5a3 3 0 0 0 0 6H12V18H7.5a1.5 1.5 0 1 1 0-3H10V13.5H7.5z"
      />
    </svg>
  ),
  FastAPI: (
    <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
      <path fill="currentColor" d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm-1.2 14.5L6.8 12l1.4-1.4 2.6 2.6 5.2-5.2 1.4 1.4-6.6 6.6z" />
    </svg>
  ),
};

export const INTRO_TECH_STACK = [
  { id: 'python', label: 'Python' },
  { id: 'tensorflow', label: 'TensorFlow' },
  { id: 'pytorch', label: 'PyTorch' },
  { id: 'react', label: 'React' },
  { id: 'nextjs', label: 'Next.js' },
  { id: 'docker', label: 'Docker' },
  { id: 'langchain', label: 'LangChain' },
  { id: 'fastapi', label: 'FastAPI' },
];

/**
 * Place logos along an arc (halo) above a center origin.
 * positions are % of container using x/y offsets in px from center.
 */
export function computeArcPositions(count, radius, startAngle = -160, endAngle = -20) {
  if (count <= 1) return [{ x: 0, y: -radius }];
  return Array.from({ length: count }, (_, i) => {
    const angle = startAngle + (i / (count - 1)) * (endAngle - startAngle);
    const rad = (angle * Math.PI) / 180;
    return {
      x: radius * Math.cos(rad),
      y: radius * Math.sin(rad),
    };
  });
}

export default function TechLogoArc({
  logos = INTRO_TECH_STACK,
  radius = 220,
  startAngle = -160,
  endAngle = -20,
  className = '',
}) {
  const positions = useMemo(
    () => computeArcPositions(logos.length, radius, startAngle, endAngle),
    [logos.length, radius, startAngle, endAngle],
  );

  return (
    <div
      className={`pointer-events-none absolute left-1/2 top-[38%] z-20 -translate-x-1/2 -translate-y-1/2 ${className}`}
      aria-hidden="true"
    >
      {logos.map((logo, i) => {
        const pos = positions[i];
        const mark = LOGO_MARKS[logo.label];
        return (
          <div
            key={logo.id}
            className="intro-tech-logo absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-accent/35 bg-surface/80 text-accent-bright shadow-glow-sm backdrop-blur-sm sm:h-12 sm:w-12 md:h-14 md:w-14"
            style={{
              left: pos.x,
              top: pos.y,
              animationDelay: `${i * 80}ms`,
              filter:
                'drop-shadow(0 0 6px rgba(139,92,246,0.85)) drop-shadow(0 0 14px rgba(124,58,237,0.55)) drop-shadow(0 0 28px rgba(124,58,237,0.3))',
            }}
            title={logo.label}
          >
            <span className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7">{mark}</span>
          </div>
        );
      })}
    </div>
  );
}
