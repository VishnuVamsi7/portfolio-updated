'use client';

import { TOKEN_COLORS } from '../../../lib/notebookProjects';

export default function InputCell({ cellIn, lines }) {
  return (
    <div className="flex gap-0 border-b border-line-subtle/60">
      <div className="w-16 shrink-0 select-none border-r border-line-subtle/40 bg-surface/40 px-3 py-4 text-right font-mono text-xs text-emerald-400/90">
        In&nbsp;[{cellIn}]:
      </div>
      <pre className="flex-1 overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed">
        {lines.map((line, li) => (
          <div key={li}>
            {line.map((tok, ti) => (
              <span key={ti} style={{ color: TOKEN_COLORS[tok.c] ?? TOKEN_COLORS.plain }}>
                {tok.t}
              </span>
            ))}
          </div>
        ))}
      </pre>
    </div>
  );
}
