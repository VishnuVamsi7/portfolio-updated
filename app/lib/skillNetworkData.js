/** Neural skill network — clusters, topology, and compiler-style type signatures. */

export const SKILL_CLUSTERS = [
  {
    id: 'core',
    label: 'Core AI/ML',
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.45)',
    cx: 0.26,
    cy: 0.34,
  },
  {
    id: 'orchestration',
    label: 'Orchestration & Agents',
    color: '#8B5CF6',
    glow: 'rgba(139,92,246,0.45)',
    cx: 0.74,
    cy: 0.34,
  },
  {
    id: 'infra',
    label: 'Infra & Deployment',
    color: '#7C3AED',
    glow: 'rgba(124,58,237,0.45)',
    cx: 0.5,
    cy: 0.74,
  },
];

/** @type {Record<string, string>} */
export const TYPE_SIGNATURES = {
  PyTorch: 'PyTorch :: (tensor: Tensor) -> Module',
  TensorFlow: 'TensorFlow :: (graph: GraphDef) -> Session',
  'Scikit-Learn': 'ScikitLearn :: (X: ndarray, y: ndarray) -> Estimator',
  NLP: 'NLP :: (corpus: Text) -> Embedding[]',
  'Computer Vision': 'CV :: (frame: ImageTensor) -> Detection[]',
  'RAG Systems': 'RAG :: (query: string) -> TaskContext[]',
  LangChain: 'LangChain :: (chain: Runnable) -> AgentExecutor',
  Groq: 'Groq :: (prompt: TokenStream) -> InferenceResponse',
  'Vector DBs': 'VectorDB :: (embedding: float[]) -> Neighbor[]',
  FastAPI: 'FastAPI :: (router: Router) -> ASGIApplication',
  Docker: 'Docker :: (image: Dockerfile) -> Container',
  Kubernetes: 'K8s :: (manifest: Deployment) -> PodSet',
  'Azure ML': 'AzureML :: (pipeline: Pipeline) -> ModelEndpoint',
  AWS: 'AWS :: (service: CloudResource) -> ProvisionedStack',
  Python: 'Python :: (script: Module) -> Any',
  Git: 'Git :: (commits: DAG) -> Repository',
};

const CLUSTER_SKILLS = {
  core: ['PyTorch', 'TensorFlow', 'Scikit-Learn', 'NLP', 'Computer Vision'],
  orchestration: ['RAG Systems', 'LangChain', 'Groq', 'Vector DBs', 'FastAPI'],
  infra: ['Docker', 'Kubernetes', 'Azure ML', 'AWS', 'Python', 'Git'],
};

/** Place nodes on a ring around each cluster centroid. */
function ringOffsets(count, radiusX, radiusY) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    return { ox: Math.cos(angle) * radiusX, oy: Math.sin(angle) * radiusY };
  });
}

const coreRing = ringOffsets(5, 0.11, 0.14);
const orchRing = ringOffsets(5, 0.11, 0.14);
const infraRing = ringOffsets(6, 0.13, 0.11);

export const SKILL_NODES = [
  ...CLUSTER_SKILLS.core.map((label, i) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    clusterId: 'core',
    ox: coreRing[i].ox,
    oy: coreRing[i].oy,
    phase: i * 1.7,
  })),
  ...CLUSTER_SKILLS.orchestration.map((label, i) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    clusterId: 'orchestration',
    ox: orchRing[i].ox,
    oy: orchRing[i].oy,
    phase: i * 1.4 + 0.5,
  })),
  ...CLUSTER_SKILLS.infra.map((label, i) => ({
    id: label.toLowerCase().replace(/\s+/g, '-'),
    label,
    clusterId: 'infra',
    ox: infraRing[i].ox,
    oy: infraRing[i].oy,
    phase: i * 1.2 + 1,
  })),
];

const byLabel = Object.fromEntries(SKILL_NODES.map((n) => [n.label, n.id]));

/** Structural edges — intra-cluster meshes + cross-domain bridges. */
export const SKILL_EDGES = [
  // Core AI/ML mesh
  ['pytorch', 'tensorflow'],
  ['tensorflow', 'scikit-learn'],
  ['scikit-learn', 'nlp'],
  ['nlp', 'computer-vision'],
  ['computer-vision', 'pytorch'],
  // Orchestration mesh
  ['rag-systems', 'langchain'],
  ['langchain', 'groq'],
  ['groq', 'vector-dbs'],
  ['vector-dbs', 'fastapi'],
  ['fastapi', 'rag-systems'],
  // Infra mesh
  ['docker', 'kubernetes'],
  ['kubernetes', 'azure-ml'],
  ['azure-ml', 'aws'],
  ['aws', 'python'],
  ['python', 'git'],
  ['git', 'docker'],
  // Cross-cluster bridges
  ['nlp', 'rag-systems'],
  ['pytorch', 'python'],
  ['tensorflow', 'python'],
  ['fastapi', 'python'],
  ['fastapi', 'docker'],
  ['rag-systems', 'vector-dbs'],
  ['langchain', 'nlp'],
  ['kubernetes', 'docker'],
  ['azure-ml', 'tensorflow'],
];

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

/** Fuzzy filter — every whitespace-separated term must appear in the label. */
export function fuzzyMatchLabel(label, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const terms = q.split(/\s+/).filter(Boolean);
  const hay = label.toLowerCase();
  return terms.every((term) => hay.includes(term));
}

/** Matching nodes + direct neighbors stay illuminated during search. */
export function getIlluminatedSet(query) {
  const all = new Set(SKILL_NODES.map((n) => n.id));
  if (!query.trim()) return { nodes: all, edges: new Set(SKILL_EDGES.map((e) => e.join(':'))) };

  const directMatches = new Set(
    SKILL_NODES.filter((n) => fuzzyMatchLabel(n.label, query)).map((n) => n.id)
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

export function getSignature(label) {
  return TYPE_SIGNATURES[label] ?? `${label.replace(/\s+/g, '')} :: () -> IO Unit`;
}

export { byLabel };
