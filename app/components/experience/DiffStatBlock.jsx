'use client';

function renderDiffLine(text) {
  const parts = text.split(/(\d+%?|\b\d+[Kk+]+\b)/g);
  return parts.map((part, i) => {
    if (/^\d+%?$/.test(part) || /^\d+[Kk+]+$/.test(part)) {
      return (
        <span key={i} className="font-bold text-emerald-400">
          {part}
        </span>
      );
    }
    return part;
  });
}

export default function DiffStatBlock({ stats }) {
  return (
    <div className="mt-1 rounded-b-xl border border-t-0 border-line-subtle bg-[#0a0b0e] px-4 py-4 font-mono text-sm md:px-5">
      <p className="mb-3 text-[10px] uppercase tracking-widest text-ink-muted">
        diff --git experience/{stats.length} files changed
      </p>
      <ul className="space-y-2">
        {stats.map((line, i) => (
          <li key={i} className="flex gap-2 leading-relaxed text-ink-secondary">
            <span className="shrink-0 font-bold text-emerald-400">+</span>
            <span>{renderDiffLine(line)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
