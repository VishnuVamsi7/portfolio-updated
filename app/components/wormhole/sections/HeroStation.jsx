/**
 * HeroStation — Station 01 (Hero) DOM overlay for the portfolio v2 wormhole.
 *
 * Renders above the fixed WebGL canvas. Root and section carry NO background
 * and NO pointer-events (the canvas behind stays clickable-through); only the
 * interactive links opt into pointer-events-auto.
 */
export default function HeroStation() {
  return (
    <section aria-label="Hero" className="relative flex min-h-screen w-full items-center justify-center px-6 py-24 sm:px-10">
      <div className="flex w-full max-w-3xl flex-col items-center text-center">
        {/* Glass panel */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-8 py-12 backdrop-blur-xl sm:px-14 sm:py-16">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#5eead4]">
            AI Developer &middot; RAG &amp; LLM Engineer
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-tight text-white sm:text-6xl">
            Sai Vishnu Vamsi
            <span className="block">Senagasetty</span>
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-base text-zinc-400 sm:text-lg">
            I ship production RAG systems &mdash; from prototype to client-ready, fast.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <a
              href="https://svishnu.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex w-full items-center justify-center rounded-xl bg-[#5eead4] px-6 py-3 text-sm font-semibold text-[#04060d] transition-colors hover:bg-[#7ef0dd] sm:w-auto"
            >
              Ask the live RAG assistant
            </a>
            <a
              href="https://svishnu.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="pointer-events-auto inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-zinc-100 backdrop-blur-xl transition-colors hover:border-white/30 hover:bg-white/[0.08] sm:w-auto"
            >
              Am I a Fit? &mdash; paste a JD
            </a>
          </div>
        </div>

        {/* Stat chips */}
        <div className="mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-xl">
            ~45% fewer ungrounded answers
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-xl">
            ~35% relevance lift
          </span>
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-zinc-300 backdrop-blur-xl">
            ~30% lead completion
          </span>
        </div>
      </div>
    </section>
  );
}
