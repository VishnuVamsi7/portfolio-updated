const CLUSTERS = [
  {
    label: "AI / Backend",
    accent: "#7dd3fc",
    skills: [
      "Python",
      "FastAPI",
      "LangChain",
      "FAISS",
      "RAG pipelines",
      "Groq / Llama",
      "prompt engineering",
      "LLM evals",
    ],
  },
  {
    label: "Frontend",
    accent: "#c4b5fd",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    label: "Data / DevOps",
    accent: "#5eead4",
    skills: ["PostgreSQL", "MongoDB", "Docker", "CI/CD", "Tableau"],
  },
];

export default function SkillsStation() {
  return (
    <section aria-label="Skills" className="relative w-full bg-transparent">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            A connected toolkit.
          </h2>
          <p className="text-sm text-zinc-400 sm:pb-1 sm:text-right">
            Three clusters, one engineer.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 pb-4 md:grid-cols-3 md:pb-12">
          {CLUSTERS.map((cluster, i) => (
            <article
              key={cluster.label}
              className={`rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl ${
                i === 1 ? "md:translate-y-8" : ""
              }`}
            >
              <h3
                className="text-xs font-semibold uppercase tracking-[0.2em]"
                style={{ color: cluster.accent }}
              >
                {cluster.label}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {cluster.skills.map((skill) => (
                  <li
                    key={skill}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-sm text-zinc-200 transition-colors duration-200 hover:border-white/30"
                  >
                    {skill}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
