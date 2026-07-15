/**
 * Complete work history — single source of truth for Git Release Changelog.
 * Newest roles first; versions assigned chronologically.
 */

export const WORK_HISTORY = [
  {
    id: 'zibtek-ai',
    title: 'AI Developer',
    company: 'Zibtek',
    date: 'April 2026 – Present',
    type: 'Full-time',
    location: 'Remote / Client delivery',
    diffStats: [
      'Situation: Joined as AI Developer inheriting a basic chatbot with weak grounding and limited routing. Task: Own production LLM quality end-to-end across client chatbot, backend, and web surfaces.',
      'Action: Re-architected the chatbot into a modular RAG pipeline (Python, FastAPI, vector retrieval → intent route → generate → validate → respond). Result: Cut ungrounded / out-of-scope answers by ~45% vs the legacy flow.',
      'Action: Added retrieval boosting, citation-ready source labels, content-policy checks, and a soft-failure review queue. Result: Lifted answer relevance / grounding quality by ~35% on regression scenario suites.',
      'Action: Built intent routing for greetings, follow-ups, refusals, and redirects so the model stayed on-task. Result: Reduced misrouted turns by ~40% and tightened average reply structure for support-style chats.',
      'Action: Implemented conversational lead capture (field extraction, scoring, missing-field prompts, CTA thresholds) inside the same chat backend. Result: Improved qualified lead completion rate by ~30% without breaking chat UX.',
      'Action: Shipped React/Vite chat UI (markdown, sessions, safety filters) plus TTS narration for guided pages. Result: Raised guided-content completion/engagement by ~25% and cut front-end iteration cycle time by ~50% with AI-assisted delivery.',
      'Action: Built a second RAG backend for generative content (FAISS, prompt templates, sanitizers, guideline enforcement, async jobs). Result: Shortened content-generation turnaround by ~60% vs manual drafting workflows.',
      'Action: Hardened FastAPI AI services with typed contracts, scenario/regression tests, and CI. Result: Caught ~50% more failure modes pre-release and stabilized chatbot releases across weekly iterations.',
      'Action: Delivered NestJS + PostgreSQL + Redis backend APIs (auth, tiers, imports) consumed by Next.js clients. Result: Accelerated feature throughput by ~35% on shared API contracts across web + mobile consumers.',
      'Action: Contributed full-stack TypeScript/React/Node and Laravel surfaces alongside AI work so models shipped behind real product UIs. Result: Reduced handoff lag between AI prototype and client-ready UI by ~40%.',
      'Action: Built an internal AI learning platform (Next.js, Firebase Auth/Firestore) with leveled quizzes, cooldown, leaderboards, and admin controls. Result: Improved team onboarding/assessment completion by ~55% for AI skill tracks.',
      'Action: Used AI-accelerated development (agents, structured PRDs, eval loops) to go from requirements → demo → production hardening. Result: Compressed delivery timelines by ~40–50% on chatbot and RAG backend milestones.',
    ],
  },
  {
    id: 'develop-for-good',
    title: 'Software Engineering Fellow',
    company: 'Develop for Good (Client: Rasdo NGO)',
    date: 'November 2025 – Present',
    type: 'Volunteer',
    diffStats: [
      'Led NGO website from Figma mockups to production deployment on Wix.',
      'Integrated Flutterwave API for cross-border donations with 100% fund retention compliance.',
      'Delivered zero-maintenance platform as primary international fundraising tool.',
      'Conducted weekly Agile sprints and code reviews with PM and UX teams.',
    ],
  },
  {
    id: 'ml-engineer-intern',
    title: 'ML Engineer',
    company: 'AI/ML Research Intern',
    date: 'January 2025 – Present',
    type: 'Full-time',
    diffStats: [
      'Accelerated product timelines by 10% through automation and ML-driven feature planning.',
      'Reduced UI/UX issues by 25% on core Flutter-based cross-platform app.',
      'Engineered ML voice-to-ride-booking pipeline with speech-to-text and NLP.',
      'Proposed AI integration strategies aligning product roadmap with mobility goals.',
    ],
  },
  {
    id: 'instructional-assistant',
    title: 'Instructional Assistant',
    company: 'University of Houston',
    date: 'September 2024 – Present',
    type: 'Part-time',
    location: 'Houston, TX',
    diffStats: [
      'Improved content update efficiency by 75% with HTML/CSS and AI-assisted workflows.',
      'Accelerated design delivery by 25% using AI-enhanced Adobe tooling.',
      'Built hand-coded bio pages, galleries, and multimedia without third-party plugins.',
      'Introduced AI capabilities to cross-functional communications teams.',
    ],
  },
  {
    id: 'yoshops-dev',
    title: 'Software Developer',
    company: 'Yoshops',
    date: '2024 – 2025',
    type: 'Project',
    diffStats: [
      'Reduced manual data processing effort by 60% via automated Python workflows.',
      'Built web scraping pipelines with BeautifulSoup, Selenium, and Scrapy for market intelligence.',
      'Designed billing system modules for transactions, invoicing, and payment tracking.',
      'Conducted EDA on large-scale datasets with pandas, NumPy, Matplotlib, and Seaborn.',
    ],
  },
  {
    id: 'nlp-research',
    title: 'NLP Research Assistant',
    company: 'University of Houston',
    date: 'January 2024 – July 2024',
    type: 'Research',
    location: 'Houston, TX',
    diffStats: [
      'Analyzed 600k+ news article sentences for pink slime misinformation patterns.',
      'Produced labeled dataset of 27K sentences with up to 8 distinct topic clusters.',
      'Found 3× sentiment exaggeration in pink slime vs legitimate journalism.',
      'Built NLP pipeline with Python, NLTK, SpaCy, TextBlob, and TF-IDF vectorization.',
    ],
  },
];

const COMMIT_HASHES = [
  'f9e2a11', '8f3a2b1', 'e7c4d92', 'c4e91d7', 'b3a8f01', '9d2e6c4',
  '7f1a3b8', '2b7f0ac', 'a1c0ff0',
];

/** Map work history to Git release cards with version tags. */
export function buildGitReleases() {
  const total = WORK_HISTORY.length;
  return WORK_HISTORY.map((job, index) => {
    const major = total - index;
    const minor = index === total - 1 ? 0 : index % 2 === 0 ? 0 : 5;
    const version =
      index === 0
        ? `v${major}.0.0`
        : minor > 0
          ? `v${major}.${minor}.0`
          : `v${major}.0.0`;

    return {
      id: job.id,
      version,
      versionLabel: index === 0 ? 'Latest Release' : job.versionLabel ?? null,
      title: job.title,
      company: job.company,
      date: job.date,
      type: job.type,
      location: job.location ?? null,
      commitHash: COMMIT_HASHES[index] ?? `a${index}b${index}c${index}`,
      diffStats: job.diffStats,
    };
  });
}

export const GIT_RELEASES = buildGitReleases();
