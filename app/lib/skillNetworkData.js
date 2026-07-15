/**
 * Neural skill knowledge graph — clusters mirror skillCategories,
 * nodes are representative skills, edges encode real dependency/workflow links.
 */
import { skillCategories } from '../data/skills';

export const SKILL_CLUSTERS = [
  {
    id: 'languages',
    label: 'Languages',
    color: '#38BDF8',
    glow: 'rgba(56,189,248,0.45)',
    cx: 0.16,
    cy: 0.22,
  },
  {
    id: 'frontend',
    label: 'Frontend & Mobile',
    color: '#34D399',
    glow: 'rgba(52,211,153,0.45)',
    cx: 0.5,
    cy: 0.16,
  },
  {
    id: 'backend',
    label: 'Backend & APIs',
    color: '#FBBF24',
    glow: 'rgba(251,191,36,0.45)',
    cx: 0.84,
    cy: 0.22,
  },
  {
    id: 'ai-llm',
    label: 'AI / LLM Systems',
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.5)',
    cx: 0.18,
    cy: 0.55,
  },
  {
    id: 'ml-dl',
    label: 'ML & Deep Learning',
    color: '#F472B6',
    glow: 'rgba(244,114,182,0.45)',
    cx: 0.5,
    cy: 0.5,
  },
  {
    id: 'data',
    label: 'Data & Analytics',
    color: '#60A5FA',
    glow: 'rgba(96,165,250,0.45)',
    cx: 0.82,
    cy: 0.55,
  },
  {
    id: 'devops',
    label: 'Cloud & DevOps',
    color: '#FB923C',
    glow: 'rgba(251,146,60,0.45)',
    cx: 0.5,
    cy: 0.84,
  },
];

/** Graph-facing nodes per cluster (readable density; full list lives in skill cards). */
const CLUSTER_SKILLS = {
  languages: ['Python', 'TypeScript', 'JavaScript', 'Dart', 'SQL', 'Bash'],
  frontend: ['React', 'Next.js', 'Vite', 'Tailwind', 'Flutter', 'Streamlit'],
  backend: ['FastAPI', 'NestJS', 'Node.js', 'PostgreSQL', 'Redis', 'Firebase Auth'],
  'ai-llm': [
    'RAG',
    'FAISS',
    'LangChain',
    'Groq',
    'Whisper',
    'Prompt Engineering',
    'Sentence Transformers',
    'ONNX',
  ],
  'ml-dl': [
    'PyTorch',
    'TensorFlow',
    'Scikit-learn',
    'NLP',
    'Computer Vision',
    'YOLOv5',
    'Stable Diffusion',
    'MLflow',
  ],
  data: ['pandas', 'PySpark', 'ETL Pipelines', 'Apache Airflow', 'EDA', 'Forecasting'],
  devops: [
    'Docker',
    'Kubernetes',
    'Azure ML',
    'GitLab CI',
    'Git',
    'Render',
    'Conda',
  ],
};

export const TYPE_SIGNATURES = {
  Python: 'Python :: (module: Script) -> Runtime',
  TypeScript: 'TypeScript :: (module: TS) -> TypedJS',
  JavaScript: 'JavaScript :: (script: ESModule) -> Browser|Node',
  Dart: 'Dart :: (lib: FlutterApp) -> MultiPlatform',
  SQL: 'SQL :: (query: Statement) -> Relation',
  Bash: 'Bash :: (cmd: Shell) -> Process',
  React: 'React :: (props: UIState) -> VirtualDOM',
  'Next.js': 'Next.js :: (route: AppRouter) -> SSR|RSC',
  Vite: 'Vite :: (entry: SPA) -> BundledAssets',
  Tailwind: 'Tailwind :: (utilities: ClassSet) -> Styles',
  Flutter: 'Flutter :: (widget: Tree) -> Mobile|Web|Desktop',
  Streamlit: 'Streamlit :: (script: PythonUI) -> DataApp',
  FastAPI: 'FastAPI :: (router: APIRouter) -> ASGIApp',
  NestJS: 'NestJS :: (module: NestModule) -> HTTPServer',
  'Node.js': 'Node.js :: (handler: Request) -> Response',
  PostgreSQL: 'PostgreSQL :: (sql: Query) -> Rows',
  Redis: 'Redis :: (key: String) -> CachedValue',
  'Firebase Auth': 'FirebaseAuth :: (token: IDToken) -> Principal',
  RAG: 'RAG :: (query: string, corpus: Chunk[]) -> GroundedAnswer',
  FAISS: 'FAISS :: (embedding: float[]) -> Neighbor[]',
  LangChain: 'LangChain :: (chain: Runnable) -> AgentResult',
  Groq: 'Groq :: (prompt: TokenStream) -> InferenceResponse',
  Whisper: 'Whisper :: (audio: Bytes) -> Transcript',
  'Prompt Engineering': 'PromptEng :: (contract: Schema) -> LLMOutput',
  'Sentence Transformers': 'SentenceTransformers :: (text: string) -> Embedding',
  ONNX: 'ONNX :: (model: Graph) -> PortableRuntime',
  PyTorch: 'PyTorch :: (tensor: Tensor) -> Module',
  TensorFlow: 'TensorFlow :: (graph: GraphDef) -> Session',
  'Scikit-learn': 'ScikitLearn :: (X: ndarray, y: ndarray) -> Estimator',
  NLP: 'NLP :: (corpus: Text) -> Features',
  'Computer Vision': 'CV :: (frame: ImageTensor) -> Detection[]',
  YOLOv5: 'YOLOv5 :: (image: Tensor) -> Boxes',
  'Stable Diffusion': 'StableDiffusion :: (prompt: Text) -> Image',
  MLflow: 'MLflow :: (run: Experiment) -> TrackedModel',
  pandas: 'pandas :: (table: DataFrame) -> TransformedDF',
  PySpark: 'PySpark :: (rdd: DataFrame) -> DistributedResult',
  'ETL Pipelines': 'ETL :: (source: Raw) -> WarehouseSlice',
  'Apache Airflow': 'Airflow :: (dag: DAG) -> TaskInstances',
  EDA: 'EDA :: (dataset: Table) -> Insights',
  Forecasting: 'Forecasting :: (series: TimeSeries) -> Predictions',
  Docker: 'Docker :: (image: Dockerfile) -> Container',
  Kubernetes: 'K8s :: (manifest: Deployment) -> PodSet',
  'Azure ML': 'AzureML :: (pipeline: Pipeline) -> Endpoint',
  'GitLab CI': 'GitLabCI :: (pipeline: YAML) -> Artifacts',
  Git: 'Git :: (commits: DAG) -> Repository',
  Render: 'Render :: (service: WebAPI) -> HostedURL',
  Conda: 'Conda :: (env: Spec) -> IsolatedPython',
};

function slugify(label) {
  return label
    .toLowerCase()
    .replace(/\+/g, 'plus')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function ringOffsets(count, radiusX, radiusY) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { ox: Math.cos(angle) * radiusX, oy: Math.sin(angle) * radiusY };
  });
}

const RING_BY_COUNT = {
  6: ringOffsets(6, 0.095, 0.11),
  7: ringOffsets(7, 0.1, 0.115),
  8: ringOffsets(8, 0.105, 0.12),
};

export const SKILL_NODES = Object.entries(CLUSTER_SKILLS).flatMap(([clusterId, labels]) => {
  const ring = RING_BY_COUNT[labels.length] ?? ringOffsets(labels.length, 0.1, 0.12);
  return labels.map((label, i) => ({
    id: slugify(label),
    label,
    clusterId,
    ox: ring[i].ox,
    oy: ring[i].oy,
    phase: i * 1.35 + (clusterId.length % 5) * 0.2,
  }));
});

const byLabel = Object.fromEntries(SKILL_NODES.map((n) => [n.label, n.id]));

function e(a, b) {
  const idA = byLabel[a];
  const idB = byLabel[b];
  if (!idA || !idB) return null;
  return [idA, idB];
}

/** Intra-cluster rings + cross-domain bridges that mirror how the stack is used. */
export const SKILL_EDGES = [
  // Languages mesh
  e('Python', 'TypeScript'),
  e('TypeScript', 'JavaScript'),
  e('JavaScript', 'Bash'),
  e('Bash', 'SQL'),
  e('SQL', 'Dart'),
  e('Dart', 'Python'),
  // Frontend mesh
  e('React', 'Next.js'),
  e('Next.js', 'Vite'),
  e('Vite', 'Tailwind'),
  e('Tailwind', 'Flutter'),
  e('Flutter', 'Streamlit'),
  e('Streamlit', 'React'),
  // Backend mesh
  e('FastAPI', 'NestJS'),
  e('NestJS', 'Node.js'),
  e('Node.js', 'PostgreSQL'),
  e('PostgreSQL', 'Redis'),
  e('Redis', 'Firebase Auth'),
  e('Firebase Auth', 'FastAPI'),
  // AI / LLM mesh
  e('RAG', 'FAISS'),
  e('FAISS', 'Sentence Transformers'),
  e('Sentence Transformers', 'ONNX'),
  e('ONNX', 'LangChain'),
  e('LangChain', 'Groq'),
  e('Groq', 'Whisper'),
  e('Whisper', 'Prompt Engineering'),
  e('Prompt Engineering', 'RAG'),
  // ML / DL mesh
  e('PyTorch', 'TensorFlow'),
  e('TensorFlow', 'Scikit-learn'),
  e('Scikit-learn', 'NLP'),
  e('NLP', 'Computer Vision'),
  e('Computer Vision', 'YOLOv5'),
  e('YOLOv5', 'Stable Diffusion'),
  e('Stable Diffusion', 'MLflow'),
  e('MLflow', 'PyTorch'),
  // Data mesh
  e('pandas', 'PySpark'),
  e('PySpark', 'ETL Pipelines'),
  e('ETL Pipelines', 'Apache Airflow'),
  e('Apache Airflow', 'EDA'),
  e('EDA', 'Forecasting'),
  e('Forecasting', 'pandas'),
  // DevOps mesh
  e('Docker', 'Kubernetes'),
  e('Kubernetes', 'Azure ML'),
  e('Azure ML', 'GitLab CI'),
  e('GitLab CI', 'Git'),
  e('Git', 'Render'),
  e('Render', 'Conda'),
  e('Conda', 'Docker'),
  // Cross-cluster bridges (how work actually flows)
  e('Python', 'FastAPI'),
  e('Python', 'PyTorch'),
  e('Python', 'pandas'),
  e('Python', 'RAG'),
  e('TypeScript', 'Next.js'),
  e('TypeScript', 'NestJS'),
  e('JavaScript', 'Node.js'),
  e('React', 'Next.js'),
  e('Dart', 'Flutter'),
  e('FastAPI', 'RAG'),
  e('FastAPI', 'Docker'),
  e('FastAPI', 'Whisper'),
  e('RAG', 'FAISS'),
  e('RAG', 'NLP'),
  e('Groq', 'Prompt Engineering'),
  e('Whisper', 'NLP'),
  e('Sentence Transformers', 'FAISS'),
  e('ONNX', 'Docker'),
  e('PyTorch', 'MLflow'),
  e('TensorFlow', 'Azure ML'),
  e('Scikit-learn', 'EDA'),
  e('NLP', 'RAG'),
  e('Computer Vision', 'YOLOv5'),
  e('pandas', 'ETL Pipelines'),
  e('PySpark', 'Docker'),
  e('Apache Airflow', 'Docker'),
  e('Next.js', 'Firebase Auth'),
  e('NestJS', 'PostgreSQL'),
  e('Node.js', 'Redis'),
  e('Streamlit', 'Python'),
  e('LangChain', 'Python'),
  e('Conda', 'Python'),
  e('GitLab CI', 'Docker'),
  e('Render', 'FastAPI'),
  e('Azure ML', 'TensorFlow'),
  e('MLflow', 'Docker'),
  e('Forecasting', 'Scikit-learn'),
].filter(Boolean);

export function getCluster(clusterId) {
  return SKILL_CLUSTERS.find((c) => c.id === clusterId);
}

export function anchorForNode(node, width, height) {
  const cluster = getCluster(node.clusterId);
  return {
    x: (cluster.cx + node.ox) * width,
    y: (cluster.cy + node.oy) * height,
  };
}

export function fuzzyMatchLabel(label, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const terms = q.split(/\s+/).filter(Boolean);
  const hay = label.toLowerCase();
  return terms.every((term) => hay.includes(term));
}

export function getIlluminatedSet(query) {
  const all = new Set(SKILL_NODES.map((n) => n.id));
  if (!query.trim()) {
    return { nodes: all, edges: new Set(SKILL_EDGES.map((edge) => edge.join(':'))) };
  }

  const directMatches = new Set(
    SKILL_NODES.filter((n) => fuzzyMatchLabel(n.label, query)).map((n) => n.id),
  );

  const illuminated = new Set(directMatches);
  SKILL_EDGES.forEach(([a, b]) => {
    if (directMatches.has(a) || directMatches.has(b)) {
      illuminated.add(a);
      illuminated.add(b);
    }
  });

  const litEdges = new Set();
  SKILL_EDGES.forEach(([a, b]) => {
    if (illuminated.has(a) && illuminated.has(b)) litEdges.add(`${a}:${b}`);
  });

  return { nodes: illuminated, edges: litEdges };
}

/**
 * Zodiac constellation templates — unit coords roughly in [0,1],
 * inspired by classic stick-figure star charts (not literal astronomy).
 * hub = index of the alpha / brightest star for the matched skill.
 */
export const ZODIAC_CONSTELLATIONS = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    points: [
      [0.18, 0.72],
      [0.32, 0.4],
      [0.5, 0.18],
      [0.68, 0.4],
      [0.82, 0.72],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
    ],
    hub: 2,
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    points: [
      [0.15, 0.35],
      [0.32, 0.28],
      [0.48, 0.42],
      [0.55, 0.58],
      [0.72, 0.62],
      [0.85, 0.48],
      [0.78, 0.28],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [2, 6],
    ],
    hub: 2,
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    points: [
      [0.28, 0.15],
      [0.28, 0.4],
      [0.28, 0.65],
      [0.28, 0.85],
      [0.72, 0.15],
      [0.72, 0.4],
      [0.72, 0.65],
      [0.72, 0.85],
      [0.5, 0.28],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [4, 5],
      [5, 6],
      [6, 7],
      [0, 4],
      [1, 8],
      [5, 8],
    ],
    hub: 8,
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    points: [
      [0.5, 0.22],
      [0.38, 0.42],
      [0.5, 0.55],
      [0.62, 0.42],
      [0.28, 0.72],
      [0.72, 0.72],
    ],
    edges: [
      [0, 1],
      [0, 3],
      [1, 2],
      [3, 2],
      [1, 4],
      [3, 5],
    ],
    hub: 2,
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    points: [
      [0.22, 0.38],
      [0.35, 0.22],
      [0.5, 0.28],
      [0.58, 0.45],
      [0.52, 0.62],
      [0.68, 0.7],
      [0.82, 0.55],
      [0.78, 0.32],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [3, 7],
    ],
    hub: 2,
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    points: [
      [0.45, 0.12],
      [0.42, 0.32],
      [0.38, 0.52],
      [0.35, 0.75],
      [0.55, 0.35],
      [0.68, 0.5],
      [0.78, 0.68],
      [0.58, 0.72],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [1, 4],
      [4, 5],
      [5, 6],
      [5, 7],
      [2, 7],
    ],
    hub: 1,
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    points: [
      [0.5, 0.18],
      [0.35, 0.4],
      [0.65, 0.4],
      [0.22, 0.62],
      [0.5, 0.58],
      [0.78, 0.62],
      [0.5, 0.82],
    ],
    edges: [
      [0, 1],
      [0, 2],
      [1, 3],
      [2, 5],
      [1, 4],
      [2, 4],
      [4, 6],
    ],
    hub: 0,
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    points: [
      [0.12, 0.35],
      [0.28, 0.32],
      [0.42, 0.38],
      [0.52, 0.48],
      [0.58, 0.62],
      [0.62, 0.78],
      [0.78, 0.72],
      [0.88, 0.58],
      [0.72, 0.42],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [3, 8],
    ],
    hub: 3,
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    points: [
      [0.35, 0.55],
      [0.5, 0.45],
      [0.65, 0.55],
      [0.5, 0.68],
      [0.5, 0.28],
      [0.72, 0.32],
      [0.28, 0.78],
      [0.78, 0.78],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
      [1, 4],
      [4, 5],
      [0, 6],
      [2, 7],
    ],
    hub: 1,
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    points: [
      [0.2, 0.45],
      [0.38, 0.32],
      [0.55, 0.28],
      [0.7, 0.4],
      [0.78, 0.58],
      [0.62, 0.72],
      [0.4, 0.68],
      [0.28, 0.58],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7],
      [7, 0],
      [2, 6],
    ],
    hub: 2,
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    points: [
      [0.22, 0.25],
      [0.38, 0.35],
      [0.52, 0.28],
      [0.68, 0.38],
      [0.82, 0.32],
      [0.35, 0.55],
      [0.55, 0.62],
      [0.75, 0.55],
      [0.5, 0.82],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [1, 5],
      [3, 7],
      [5, 6],
      [6, 7],
      [6, 8],
    ],
    hub: 2,
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    points: [
      [0.18, 0.3],
      [0.28, 0.45],
      [0.22, 0.62],
      [0.5, 0.5],
      [0.78, 0.3],
      [0.72, 0.45],
      [0.82, 0.62],
      [0.5, 0.72],
    ],
    edges: [
      [0, 1],
      [1, 2],
      [0, 2],
      [1, 3],
      [4, 5],
      [5, 6],
      [4, 6],
      [5, 3],
      [3, 7],
    ],
    hub: 3,
  },
];

function hashString(value) {
  let h = 0;
  for (let i = 0; i < value.length; i += 1) {
    h = (h * 31 + value.charCodeAt(i)) >>> 0;
  }
  return h;
}

function projectConstellationPoint([nx, ny], width, height) {
  const padX = width * 0.14;
  const padY = height * 0.14;
  return {
    x: padX + nx * (width - padX * 2),
    y: padY + ny * (height - padY * 2),
  };
}

/**
 * Search layout: map matched skill + connected skills onto a zodiac
 * constellation stick-figure (celestial alignment aesthetic).
 */
export function getConstellationLayout(query, width, height) {
  const q = query.trim();
  if (!q || width <= 0 || height <= 0) return null;

  const hubs = SKILL_NODES.filter((n) => fuzzyMatchLabel(n.label, q)).map((n) => n.id);
  if (!hubs.length) return null;

  const neighborSet = new Set();
  SKILL_EDGES.forEach(([a, b]) => {
    if (hubs.includes(a) && !hubs.includes(b)) neighborSet.add(b);
    if (hubs.includes(b) && !hubs.includes(a)) neighborSet.add(a);
  });
  const neighbors = [...neighborSet].sort();

  // Prefer a constellation with enough points for hub + neighbors
  const needed = hubs.length + neighbors.length;
  const ranked = [...ZODIAC_CONSTELLATIONS].sort((a, b) => {
    const da = Math.abs(a.points.length - Math.max(needed, 5));
    const db = Math.abs(b.points.length - Math.max(needed, 5));
    return da - db;
  });
  const pickIndex = hashString(q.toLowerCase()) % Math.min(4, ranked.length);
  const constellation = ranked[pickIndex];

  const projected = constellation.points.map((p) => projectConstellationPoint(p, width, height));
  const targets = new Map();
  const assignment = new Array(projected.length).fill(null);

  // Alpha star gets the first matched skill
  const primaryHub = hubs[0];
  assignment[constellation.hub] = primaryHub;
  targets.set(primaryHub, { ...projected[constellation.hub], role: 'hub', slot: constellation.hub });

  // Remaining hubs, then neighbors, fill other constellation stars by proximity to hub
  const remainingSlots = projected
    .map((p, i) => ({ i, d: Math.hypot(p.x - projected[constellation.hub].x, p.y - projected[constellation.hub].y) }))
    .filter((s) => s.i !== constellation.hub)
    .sort((a, b) => a.d - b.d)
    .map((s) => s.i);

  const queue = [...hubs.slice(1), ...neighbors];
  let slotPtr = 0;
  queue.forEach((id) => {
    while (slotPtr < remainingSlots.length && assignment[remainingSlots[slotPtr]] != null) {
      slotPtr += 1;
    }
    if (slotPtr >= remainingSlots.length) {
      // Overflow: place along the outer rim near the last constellation star
      const last = projected[projected.length - 1];
      const angle = (targets.size / Math.max(queue.length, 1)) * Math.PI * 2;
      targets.set(id, {
        x: last.x + Math.cos(angle) * 28,
        y: last.y + Math.sin(angle) * 28,
        role: hubs.includes(id) ? 'hub' : 'ray',
        slot: -1,
      });
      return;
    }
    const slot = remainingSlots[slotPtr];
    assignment[slot] = id;
    targets.set(id, {
      ...projected[slot],
      role: hubs.includes(id) ? 'hub' : 'ray',
      slot,
    });
    slotPtr += 1;
  });

  // Unrelated skills fade to a night-sky scatter (dim field stars)
  const cx = width * 0.5;
  const cy = height * 0.5;
  SKILL_NODES.forEach((node, idx) => {
    if (targets.has(node.id)) return;
    const seed = hashString(node.id + q);
    const angle = ((seed % 360) / 360) * Math.PI * 2;
    const radius = Math.min(width, height) * (0.42 + ((seed >> 8) % 20) / 100);
    targets.set(node.id, {
      x: cx + Math.cos(angle + idx * 0.15) * radius,
      y: cy + Math.sin(angle + idx * 0.15) * radius * 0.85,
      role: 'far',
      slot: -1,
    });
  });

  // Constellation stick lines between assigned stars
  const figureEdges = constellation.edges
    .map(([i, j]) => {
      const a = assignment[i];
      const b = assignment[j];
      if (!a || !b) return null;
      return [a, b];
    })
    .filter(Boolean);

  return {
    hubs,
    neighbors,
    constellation,
    figureEdges,
    starPoints: projected,
    assignment,
    center: { x: cx, y: cy },
    targets,
  };
}

/** @deprecated alias — constellation layout is the search formation */
export function getStarLayout(query, width, height) {
  return getConstellationLayout(query, width, height);
}

export function getSignature(label) {
  return TYPE_SIGNATURES[label] ?? `${label.replace(/\s+/g, '')} :: () -> Capability`;
}

/** Full taxonomy categories — used by Skills section cards under the graph. */
export { skillCategories };

export { byLabel };
