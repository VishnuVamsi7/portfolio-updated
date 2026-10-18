const BRANCHES = [
  {
    label: "RAG / LLM",
    accent: "#5eead4",
    cards: [
      {
        title: "Legacy Chatbot → Production RAG",
        outcome:
          "Rebuilt a legacy chatbot into production RAG at Zibtek: FastAPI, FAISS retrieval, intent routing, policy validation, React chat UI, lead scoring.",
        metric: "~45% fewer ungrounded answers · ~35% relevance lift · ~30% lead completion",
        tech: "FastAPI · FAISS · LangChain · React",
      },
      {
        title: "DocReporter",
        outcome:
          "200+ page PDFs → 5–8 page summaries via Kreuzberg/LayoutParser, charts in reports, Airflow + Docker Compose pipeline.",
        tech: "Python · LayoutParser · Airflow · Docker",
      },
    ],
  },
  {
    label: "Full-Stack",
    accent: "#c4b5fd",
    cards: [
      {
        title: "GammaStrat Portal + Marketing Site",
        outcome:
          "AI-assisted build in Cursor: 10 portal + 5 marketing-site co-authored commits.",
        tech: "Next.js · TypeScript · Tailwind CSS",
      },
      {
        title: "Ask Heaven",
        outcome: "8 commits, merged to main.",
        tech: "Next.js · React",
      },
    ],
  },
  {
    label: "Data / ML",
    accent: "#fbbf24",
    cards: [
      {
        title: "Pink Slime Journalism Analysis",
        outcome:
          "27,601 scraped articles → 123,578-row dataset; SVD + t-SNE + K-Means clustering.",
        tech: "Python · SVD · t-SNE · K-Means",
      },
      {
        title: "Energy Provider Churn",
        outcome:
          "Random Forest at 90.4% accuracy (honest 4.6% recall) on merged customer + pricing data.",
        tech: "Python · Random Forest",
      },
    ],
  },
];

const PROFILE_URL = "https://github.com/VishnuVamsi7";

function ProjectCard({ card, accent }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-xl p-5 transition-colors duration-300 motion-reduce:transition-none">
      <span
        aria-hidden="true"
        className="mb-4 block h-2 w-2 rounded-full"
        style={{ backgroundColor: accent }}
      />
      <h3 className="text-base font-semibold text-white">{card.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-zinc-400">{card.outcome}</p>
      {card.metric ? (
        <p className="mt-2 text-xs font-medium" style={{ color: accent }}>
          {card.metric}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-zinc-500">{card.tech}</p>
      <a
        href={PROFILE_URL}
        target="_blank"
        rel="noreferrer"
        className="pointer-events-auto mt-4 inline-block text-sm font-medium transition-opacity hover:opacity-80"
        style={{ color: accent }}
      >
        View →
      </a>
    </article>
  );
}

export default function ProjectsStation() {
  return (
    <section aria-label="Projects" className="w-full bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Built for the real world.
          </h2>
          <p className="text-sm text-zinc-400 sm:text-right">
            Production systems, shipped — not tutorials.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {BRANCHES.map((branch) => (
            <div key={branch.label}>
              <p
                className="mb-4 text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: branch.accent }}
              >
                {branch.label}
              </p>
              <div className="flex flex-col gap-5">
                {branch.cards.map((card) => (
                  <ProjectCard
                    key={card.title}
                    card={card}
                    accent={branch.accent}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
