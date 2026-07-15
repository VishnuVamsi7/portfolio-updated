import { projects } from './projects';
import { allSkills, skillCategories } from './skills';

export const profile = {
  name: 'Sai Vishnu Vamsi Senagasetty',
  titles: ['AI Developer', 'AI Engineer', 'Machine Learning Engineer', 'Full-Stack AI Builder'],
  location: 'Houston, Texas',
  education: [
    {
      degree: 'Master of Science in Computer Science',
      school: 'University of Houston',
      period: 'August 2023 - May 2025',
    },
    {
      degree: 'Bachelor of Technology in Computer Science',
      school: 'SRM University, AP',
      period: 'June 2019 - May 2023',
    },
  ],
  experience: [
    {
      id: 'zibtek-ai',
      title: 'AI Developer',
      company: 'Zibtek',
      period: 'April 2026 - Present',
      skills: [
        'RAG',
        'LLMs',
        'FastAPI',
        'Python',
        'FAISS',
        'Prompt Engineering',
        'Next.js',
        'NestJS',
        'React',
        'Vector Search',
      ],
      summary:
        'AI Developer using STAR delivery on confidential client work: evolved a basic chatbot into FastAPI/RAG with ~45% fewer ungrounded answers, plus NestJS/Next backends and AI-accelerated shipping (~40–50% faster milestones).',
    },
    {
      id: 'develop-for-good',
      title: 'Software Engineering Fellow',
      company: 'Develop for Good (Client: Rasdo NGO)',
      period: 'November 2025 - Present',
      skills: ['JavaScript', 'Wix', 'API Integration', 'Agile', 'Flutterwave API'],
      summary:
        'Led NGO website from Figma to production with payment API integration and Agile delivery.',
    },
    {
      id: 'ml-engineer-intern',
      title: 'ML Engineer',
      company: 'AI/ML Research Intern',
      period: 'January 2025 - Present',
      skills: ['Machine Learning', 'Flutter', 'NLP', 'Speech-to-Text', 'ML Pipelines'],
      summary:
        'Built ML voice-to-ride booking pipeline and accelerated product timelines with automation.',
    },
    {
      id: 'instructional-assistant',
      title: 'Instructional Assistant',
      company: 'University of Houston',
      period: 'September 2024 - Present',
      skills: ['HTML/CSS', 'CMS', 'AI Workflows', 'Adobe', 'Web Development'],
      summary:
        'Modernized university websites and introduced AI-assisted content workflows.',
    },
    {
      id: 'yoshops-dev',
      title: 'Software Developer',
      company: 'Yoshops',
      period: '2024 - 2025',
      skills: ['Python', 'Web Scraping', 'pandas', 'Automation', 'EDA'],
      summary: 'Built scraping pipelines, billing modules, and automated data workflows.',
    },
    {
      id: 'nlp-research',
      title: 'NLP Research Assistant',
      company: 'University of Houston',
      period: 'January 2024 - July 2024',
      skills: ['NLP', 'Python', 'Research', 'Text Processing'],
      summary: 'Pink slime misinformation research across 600k+ sentences and 27K labeled dataset.',
    },
  ],
  skills: allSkills,
  skillCategories,
  projects: projects.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    tags: p.tags,
    techStack: p.techStack,
    goal: p.goal,
    outcome: p.outcome,
    github: p.github,
  })),
  pitch:
    'Sai Vishnu Vamsi Senagasetty is an AI Developer at Zibtek who ships confidential production RAG chatbots and LLM backends (Python/FastAPI, FAISS, React/Next/Nest)—improving grounding, lead conversion, and delivery speed by tens of percent through STAR-framed, measurable iteration.',
};

export function getSkillTaxonomy() {
  const aliases = {
    'machine learning': ['ml', 'machine learning', 'predictive analytics', 'deep learning', 'scikit-learn', 'mlflow'],
    'deep learning': ['deep learning', 'neural network', 'cnn', 'rnn', 'transformer', 'pytorch', 'tensorflow', 'unet'],
    python: ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'fastapi', 'numpy'],
    rag: ['rag', 'retrieval', 'llm', 'langchain', 'groq', 'prompt engineering', 'faiss', 'vector search', 'onnx'],
    nlp: ['nlp', 'natural language', 'text processing', 'whisper', 'sentiment', 'tf-idf', 'topic modeling'],
    'computer vision': ['computer vision', 'yolo', 'yolov5', 'opencv', 'image', 'detection', 'stable diffusion'],
    docker: ['docker', 'kubernetes', 'container', 'k8s', 'docker compose'],
    azure: ['azure', 'azure ml', 'cloud', 'render', 'netlify'],
    sql: ['sql', 'database', 'etl', 'postgresql', 'redis', 'firestore'],
    javascript: ['javascript', 'react', 'next.js', 'node', 'typescript', 'vite', 'nestjs', 'express'],
    mobile: ['flutter', 'dart', 'android', 'ios', 'cross-platform'],
    deployment: ['deployment', 'serving', 'mlops', 'ci/cd', 'model deployment', 'gitlab ci', 'github actions'],
    data: ['data science', 'analytics', 'pandas', 'spark', 'pyspark', 'visualization', 'airflow', 'eda'],
    backend: ['fastapi', 'nestjs', 'node.js', 'express', 'rest apis', 'pydantic'],
  };

  return { skills: allSkills, aliases };
}
