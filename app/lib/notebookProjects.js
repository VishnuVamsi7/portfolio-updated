import { projects } from '../data/projects';

export const TOKEN_COLORS = {
  kw: '#C792EA',
  mod: '#82AAFF',
  cls: '#FFCB6B',
  fn: '#82AAFF',
  str: '#C3E88D',
  plain: '#ABB2BF',
};

const GRADIO_OVERRIDES = {
  'pink-slime': { gradioType: 'pink-slime' },
  imagecraft: { gradioType: 'imagecraft' },
  'portfolio-rag': { gradioType: 'portfolio-rag' },
};

function skillLines(project) {
  const skills = project.techStack ?? [];
  const preview = skills.slice(0, 5).map((s) => `"${s}"`).join(', ');
  const more = skills.length > 5 ? `, ... (+${skills.length - 5} more)` : '';
  return [
    [{ t: 'skills', c: 'cls' }, { t: ' = ', c: 'plain' }, { t: `[${preview}${more}]`, c: 'str' }],
    [{ t: 'domains', c: 'cls' }, { t: ' = ', c: 'plain' }, { t: `"${project.tags.join(' · ')}"`, c: 'str' }],
    [
      { t: 'depth', c: 'cls' },
      { t: ' = ', c: 'plain' },
      { t: '"problem → approach → build → impact"', c: 'str' },
    ],
  ];
}

function listBlock(title, items) {
  if (!items?.length) return '';
  return `### ${title}

${items.map((item) => `- ${item}`).join('\n')}`;
}

function ensurePipeline(project) {
  if (project.pipeline?.length) return project.pipeline;
  const stack = (project.techStack ?? []).slice(0, 5).join(', ');
  return [
    `Clarify the problem space and success criteria for **${project.shortTitle}**`,
    `Choose an approach suited to the constraints (see “Why this approach fits”)`,
    `Implement with core stack: ${stack}`,
    `Assemble services/UI into a runnable end-to-end path`,
    `Evaluate with offline checks / demos and capture measurable impact`,
  ];
}

function ensureComponents(project) {
  if (project.components?.length) return project.components;
  return (project.techStack ?? []).slice(0, 6).map((skill) => `**${skill}** — used as a primary capability in this build`);
}

function buildMarkdown(project) {
  const pipeline = ensurePipeline(project);
  const components = ensureComponents(project);
  const sections = [
    `### Problem

${project.goal}`,
    listBlock(
      'Skills used',
      (project.techStack ?? []).map((s) => `**${s}**`),
    ),
    `### Approach

${project.approach}`,
    `### Why this approach fits

${project.whyApproach}`,
    listBlock('System design / pipeline', pipeline),
    listBlock('Key components', components),
    `### How it was built

${project.howBuilt}`,
    project.evals
      ? `### Evaluation & quality gates

${project.evals}`
      : '',
    `### Impact

${project.outcome}`,
  ];

  return sections.filter(Boolean).join('\n\n');
}

export const NOTEBOOK_PROJECTS = projects.map((project, index) => {
  const override = GRADIO_OVERRIDES[project.id];
  return {
    id: project.id,
    label: project.shortTitle,
    cellIn: index + 1,
    title: project.title,
    subtitle: project.subtitle,
    shortTitle: project.shortTitle,
    tags: project.tags,
    github: project.github,
    presentation: project.presentation,
    report: project.report,
    techStack: project.techStack,
    outcome: project.outcome,
    approach: project.approach,
    whyApproach: project.whyApproach,
    howBuilt: project.howBuilt,
    pipeline: project.pipeline,
    components: project.components,
    evals: project.evals,
    pythonLines: skillLines(project),
    markdown: buildMarkdown(project),
    gradioType: override?.gradioType ?? null,
  };
});

export function getNotebookProject(id) {
  return NOTEBOOK_PROJECTS.find((p) => p.id === id) ?? NOTEBOOK_PROJECTS[0];
}
