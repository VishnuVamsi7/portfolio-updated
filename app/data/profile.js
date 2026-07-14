import { projects } from './projects';
import { allSkills, skillCategories } from './skills';

export const profile = {
  name: 'Sai Vishnu Vamsi Senagasetty',
  titles: ['AI Engineer', 'Machine Learning Engineer', 'Data Science Engineer'],
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
      id: 'napca-analyst',
      title: 'Marketing Strategy Analyst (Volunteer)',
      company: 'National Asian Pacific Center on Aging',
      period: 'June 2025 - Present',
      skills: ['Marketing Analytics', 'Strategy', 'Data Analysis'],
      summary: '100% data-driven campaign strategy and outreach metric optimization.',
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
    {
      id: 'eprovider-intern',
      title: 'HR and Account Management Intern',
      company: 'eProvider Care Technologies',
      period: 'July 2021 - May 2023',
      skills: ['Account Management', 'HR Operations', 'Workflows'],
      summary: 'Streamlined account management and cross-functional operational workflows.',
    },
    {
      id: 'unschool-intern',
      title: 'Sales and Marketing Intern',
      company: 'Unschool Startup',
      period: 'May 2021 - December 2021',
      skills: ['Sales', 'Marketing', 'Outreach'],
      summary: 'Initialized sales pipeline and marketing outreach programs.',
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
    'Sai Vishnu Vamsi Senagasetty is an AI/ML engineer with hands-on experience in RAG systems, LLM deployment, model serving benchmarks, NLP, computer vision, and production ML pipelines—combining research depth with full-stack delivery.',
};

export function getSkillTaxonomy() {
  const aliases = {
    'machine learning': ['ml', 'machine learning', 'predictive analytics', 'deep learning'],
    'deep learning': ['deep learning', 'neural network', 'cnn', 'rnn', 'transformer'],
    python: ['python', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas'],
    rag: ['rag', 'retrieval', 'llm', 'langchain', 'groq', 'prompt engineering'],
    nlp: ['nlp', 'natural language', 'text processing', 'whisper', 'sentiment'],
    'computer vision': ['computer vision', 'yolo', 'opencv', 'image', 'detection'],
    docker: ['docker', 'kubernetes', 'container', 'k8s'],
    azure: ['azure', 'azure ml', 'cloud'],
    sql: ['sql', 'database', 'etl'],
    javascript: ['javascript', 'react', 'next.js', 'node', 'typescript'],
    deployment: ['deployment', 'serving', 'mlops', 'ci/cd', 'model deployment'],
    data: ['data science', 'analytics', 'pandas', 'spark', 'visualization'],
  };

  return { skills: allSkills, aliases };
}
