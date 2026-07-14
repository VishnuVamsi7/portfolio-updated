/**
 * Complete work history — single source of truth for Git Release Changelog.
 * Newest roles first; versions assigned chronologically.
 */

export const WORK_HISTORY = [
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
    id: 'napca-analyst',
    title: 'Marketing Strategy Analyst (Volunteer)',
    company: 'National Asian Pacific Center on Aging',
    date: 'June 2025 – Present',
    type: 'Volunteer',
    diffStats: [
      '100% data-driven strategy alignment for targeted outreach campaigns.',
      'Analyzed outreach metrics to optimize engagement and campaign ROI.',
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
  {
    id: 'eprovider-intern',
    title: 'HR and Account Management Intern',
    company: 'eProvider Care Technologies',
    date: 'July 2021 – May 2023',
    type: 'Internship',
    diffStats: [
      'Streamlined account management protocols across client portfolios.',
      'Managed cross-functional operational workflows between HR and account teams.',
    ],
  },
  {
    id: 'unschool-intern',
    title: 'Sales and Marketing Intern',
    company: 'Unschool Startup',
    date: 'May 2021 – December 2021',
    type: 'Internship',
    versionLabel: 'Initial Commit',
    diffStats: [
      'Initialized sales pipeline and marketing outreach programs.',
      'Supported early-stage customer acquisition and brand positioning.',
    ],
  },
];

const COMMIT_HASHES = [
  '8f3a2b1', 'e7c4d92', 'c4e91d7', 'b3a8f01', '9d2e6c4',
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
