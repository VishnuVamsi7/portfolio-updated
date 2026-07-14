import { projects } from '../data/projects';

export const TOKEN_COLORS = {
  kw: '#C792EA',
  mod: '#82AAFF',
  cls: '#FFCB6B',
  fn: '#82AAFF',
  str: '#C3E88D',
  plain: '#ABB2BF',
};

/** Interactive Gradio mocks — only these three. */
const GRADIO_OVERRIDES = {
  'pink-slime': {
    filename: 'pink_slime_analysis.ipynb',
    gradioType: 'pink-slime',
    pythonLines: [
      [{ t: 'from', c: 'kw' }, { t: ' pink_slime', c: 'mod' }, { t: ' import', c: 'kw' }, { t: ' MisinfoPipeline', c: 'cls' }],
      [{ t: 'model = ', c: 'plain' }, { t: 'load_pipeline', c: 'fn' }, { t: '("Pink_Slime_Detection")', c: 'str' }],
      [{ t: 'signatures = model.', c: 'plain' }, { t: 'predict', c: 'fn' }, { t: '(article_text)', c: 'plain' }],
      [{ t: 'signatures', c: 'plain' }],
    ],
    markdown: `### Architecture

Clustered **27,000+** news sentences across Politics, Business, and Health categories using PCA + K-Means to surface stylistic divergence between legitimate journalism and **pink slime** content farms.

**Pipeline:** tokenization → sentiment exaggeration scoring → readability metrics → cluster assignment → signature extraction for downstream classifiers.`,
  },
  imagecraft: {
    filename: 'imagecraft_genai.ipynb',
    gradioType: 'imagecraft',
    pythonLines: [
      [{ t: 'from', c: 'kw' }, { t: ' imagecraft', c: 'mod' }, { t: ' import', c: 'kw' }, { t: ' Text2ImageUNet', c: 'cls' }],
      [{ t: 'pipe = ', c: 'plain' }, { t: 'load_sd_pipeline', c: 'fn' }, { t: '(checkpoint="sd-v1.5-ft")', c: 'str' }],
      [{ t: 'image = pipe.', c: 'plain' }, { t: 'generate', c: 'fn' }, { t: '(prompt, steps=30)', c: 'plain' }],
      [{ t: 'image', c: 'plain' }],
    ],
    markdown: `### Architecture

Custom **UNet_SD** backbone with transformer cross-attention layers fine-tuned on Stable Diffusion v1.5. Text encoder embeddings condition the diffusion scheduler for prompt-aligned synthesis.

**Metrics:** improved FID vs baseline; modular Text2Image pipeline deployable as a Gradio demo or batch inference worker.`,
  },
  'portfolio-rag': {
    filename: 'portfolio_rag_agent.ipynb',
    gradioType: 'portfolio-rag',
    pythonLines: [
      [{ t: 'from', c: 'kw' }, { t: ' portfolio_rag', c: 'mod' }, { t: ' import', c: 'kw' }, { t: ' GroqAssistant', c: 'cls' }],
      [{ t: 'agent = ', c: 'plain' }, { t: 'GroqAssistant', c: 'cls' }, { t: '(retriever="profile_index")', c: 'str' }],
      [{ t: 'response = agent.', c: 'plain' }, { t: 'query', c: 'fn' }, { t: '("experience with vector DBs?")', c: 'str' }],
      [{ t: 'response', c: 'plain' }],
    ],
    markdown: `### Architecture

Low-latency **Groq** inference over a custom RAG index built from structured profile data — skills, projects, experience, and achievements. Conversational memory keeps multi-turn context without a heavy vector database.

**Result:** ~40–50% faster responses vs baseline; production deployment on Render with FastAPI backend.`,
  },
};

function slugToModule(id) {
  return id.replace(/-/g, '_');
}

function idToFilename(id) {
  return `${slugToModule(id)}.ipynb`;
}

function defaultPythonLines(project) {
  const mod = slugToModule(project.id);
  const fn = project.shortTitle.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || 'run_pipeline';
  return [
    [{ t: 'from', c: 'kw' }, { t: ` ${mod}`, c: 'mod' }, { t: ' import', c: 'kw' }, { t: ' Pipeline', c: 'cls' }],
    [{ t: 'model = ', c: 'plain' }, { t: 'Pipeline', c: 'cls' }, { t: '.from_config()', c: 'fn' }],
    [{ t: 'result = model.', c: 'plain' }, { t: fn.toLowerCase(), c: 'fn' }, { t: '()', c: 'plain' }],
    [{ t: 'result', c: 'plain' }],
  ];
}

function defaultMarkdown(project) {
  return `### Objective

${project.goal}

### Outcome

${project.outcome}`;
}

/** All portfolio projects as notebook cells (8 total). */
export const NOTEBOOK_PROJECTS = projects.map((project, index) => {
  const override = GRADIO_OVERRIDES[project.id];
  return {
    id: project.id,
    filename: override?.filename ?? idToFilename(project.id),
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
    pythonLines: override?.pythonLines ?? defaultPythonLines(project),
    markdown: override?.markdown ?? defaultMarkdown(project),
    gradioType: override?.gradioType ?? null,
  };
});

export function getNotebookProject(id) {
  return NOTEBOOK_PROJECTS.find((p) => p.id === id) ?? NOTEBOOK_PROJECTS[0];
}
