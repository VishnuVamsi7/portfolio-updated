'use client';

import GradioShell from './GradioShell';

export default function DefaultProjectOutput({ project }) {
  return (
    <GradioShell label="metrics">
      <div className="space-y-4 font-body text-sm text-ink-secondary">
        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-muted">Result summary</p>
          <p className="leading-relaxed text-ink-primary/90">{project.outcome}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <span
              key={tag}
              className="rounded border border-accent/25 bg-accent/10 px-2 py-0.5 font-mono text-[10px] text-accent-bright"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-line-subtle pt-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="cursor-pointer rounded-md border border-line-subtle px-3 py-1.5 font-mono text-xs text-ink-secondary transition-colors duration-200 hover:border-accent/40 hover:text-accent-bright"
            >
              GitHub ↗
            </a>
          )}
          {project.report && (
            <a
              href={project.report}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="cursor-pointer rounded-md border border-line-subtle px-3 py-1.5 font-mono text-xs text-ink-secondary transition-colors duration-200 hover:border-accent/40 hover:text-accent-bright"
            >
              Report ↗
            </a>
          )}
          {project.presentation && (
            <a
              href={project.presentation}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="cursor-pointer rounded-md border border-line-subtle px-3 py-1.5 font-mono text-xs text-ink-secondary transition-colors duration-200 hover:border-accent/40 hover:text-accent-bright"
            >
              Presentation ↗
            </a>
          )}
          {!project.github && !project.report && !project.presentation && (
            <span className="font-mono text-xs text-ink-muted">// artifacts available on request</span>
          )}
        </div>
      </div>
    </GradioShell>
  );
}
