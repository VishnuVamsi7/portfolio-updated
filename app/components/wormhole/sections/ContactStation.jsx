export default function ContactStation() {
  return (
    <section
      aria-label="Contact"
      className="relative w-full px-6 py-32 sm:py-40 md:py-48"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <p className="mb-6 text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
          04 &mdash; Contact
        </p>

        <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
          Let&rsquo;s build something that ships.
        </h2>

        <a
          href="mailto:saivishnuvamsis07@gmail.com"
          className="pointer-events-auto mt-10 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.06] px-7 py-3.5 text-base text-zinc-100 backdrop-blur-xl transition-colors duration-200 hover:border-white/20 hover:bg-white/[0.1] hover:text-white"
        >
          <span>saivishnuvamsis07@gmail.com</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="shrink-0"
          >
            <path d="M7 17L17 7" />
            <path d="M7 7h10v10" />
          </svg>
        </a>

        <div className="mt-8 flex items-center gap-6 text-sm text-zinc-400">
          <a
            href="https://linkedin.com/in/vishnu-senagasetty"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto transition-colors duration-200 hover:text-white"
          >
            LinkedIn
          </a>
          <span
            aria-hidden="true"
            className="h-1 w-1 rounded-full bg-zinc-600"
          />
          <a
            href="https://github.com/VishnuVamsi7"
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto transition-colors duration-200 hover:text-white"
          >
            GitHub
          </a>
        </div>

        <p className="mt-10 text-sm text-zinc-500">
          Houston, TX &middot; open to remote / hybrid
        </p>
        <p className="mt-3 text-sm text-zinc-500">
          Actively seeking full-time AI Developer / AI Engineer roles
        </p>
      </div>
    </section>
  );
}
