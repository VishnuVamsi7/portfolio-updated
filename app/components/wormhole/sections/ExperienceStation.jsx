const ENTRIES = [
  {
    role: "AI Developer",
    company: "Zibtek · Houston, TX",
    dates: "Apr 2026 – Present",
    badge: "Current",
    current: true,
    description:
      "Production RAG/LLM systems: FastAPI + FAISS retrieval, intent routing, policy validation, React chat UI, lead scoring. Client-facing: requirements gathering, architecture walkthroughs, technical interviews, delivery leadership.",
    metric: "~45% fewer ungrounded answers · ~35% relevance lift · ~30% lead completion",
  },
  {
    role: "AI Software Engineer",
    company: "boomerroomers LLC",
    dates: "Jan 2026 – Apr 2026",
    current: false,
  },
  {
    role: "AI Researcher Fellow (Remote)",
    company: "Handshake",
    dates: "Dec 2025 – Feb 2026",
    current: false,
    description:
      "Ground-truth evaluation datasets from end-to-end model stress tests, supporting iterative model training.",
  },
  {
    role: "NLP Research Assistant",
    company: "University of Houston",
    dates: "Jan 2024 – Jul 2024",
    current: false,
  },
];

const EDUCATION = [
  "M.S. Computer Science — University of Houston (2023–2025)",
  "B.Tech Computer Science — SRM University, AP (2019–2023)",
];

function TimelineEntry({ entry }) {
  const dot = entry.current ? "bg-[#5eead4]" : "bg-zinc-600";
  return (
    <div className="relative pl-8 sm:pl-10">
      <span
        aria-hidden="true"
        className={`absolute left-[5px] top-7 h-2.5 w-2.5 rounded-full ${dot}`}
      />
      <article className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-xl sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-base font-semibold text-white sm:text-lg">
            {entry.role}
          </h3>
          {entry.badge ? (
            <span className="rounded-full border border-[#5eead4]/30 bg-[#5eead4]/10 px-2.5 py-0.5 text-xs font-medium text-[#5eead4]">
              {entry.badge}
            </span>
          ) : null}
        </div>
        <p className="mt-1 text-sm text-zinc-400">
          {entry.company} <span className="text-zinc-600">·</span> {entry.dates}
        </p>
        {entry.description ? (
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            {entry.description}
          </p>
        ) : null}
        {entry.metric ? (
          <p className="mt-3 text-xs font-medium text-[#5eead4]">
            {entry.metric}
          </p>
        ) : null}
      </article>
    </div>
  );
}

export default function ExperienceStation() {
  return (
    <section aria-label="Experience" className="relative w-full bg-transparent">
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            The road so far.
          </h2>
          <p className="text-sm text-zinc-400 sm:text-right">
            Shipped work, in order.
          </p>
        </div>

        <div className="relative mt-10">
          <span
            aria-hidden="true"
            className="absolute bottom-4 left-[9px] top-4 w-px bg-white/10"
          />
          <div className="flex flex-col gap-6">
            {ENTRIES.map((entry) => (
              <TimelineEntry key={entry.role} entry={entry} />
            ))}
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {EDUCATION.map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-xl"
            >
              <p className="text-sm text-zinc-300">{item}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
