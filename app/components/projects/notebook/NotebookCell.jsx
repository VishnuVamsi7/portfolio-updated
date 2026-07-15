'use client';

import InputCell from './InputCell';
import MarkdownCell from './MarkdownCell';
import PinkSlimeGradio from './PinkSlimeGradio';
import ImageCraftGradio from './ImageCraftGradio';
import PortfolioRagGradio from './PortfolioRagGradio';
import DefaultProjectOutput from './DefaultProjectOutput';

const GRADIO_MAP = {
  'pink-slime': PinkSlimeGradio,
  imagecraft: ImageCraftGradio,
  'portfolio-rag': PortfolioRagGradio,
};

export default function NotebookCell({ project }) {
  const GradioComponent = GRADIO_MAP[project.gradioType];

  return (
    <article className="overflow-hidden rounded-lg border border-line-subtle bg-[#12131a]">
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line-subtle/80 bg-surface/60 px-4 py-3">
        <div className="min-w-0">
          <h3 className="font-display text-lg font-bold text-ink-primary">{project.title}</h3>
          <p className="mt-0.5 text-sm text-ink-secondary">{project.subtitle}</p>
        </div>
        <div className="flex max-w-full flex-wrap items-center gap-2">
          {project.techStack.map((t) => (
            <span
              key={t}
              className="rounded border border-line-subtle px-2 py-0.5 font-mono text-[10px] text-ink-muted"
            >
              {t}
            </span>
          ))}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="pointer"
              className="cursor-pointer font-mono text-[10px] text-accent-bright transition-colors duration-200 hover:text-ink-primary"
            >
              github ↗
            </a>
          )}
        </div>
      </header>

      <InputCell lines={project.pythonLines} />
      <MarkdownCell content={project.markdown} />
      {GradioComponent ? <GradioComponent /> : <DefaultProjectOutput project={project} />}
    </article>
  );
}
