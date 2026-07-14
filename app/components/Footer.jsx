import LastUpdated from './seo/LastUpdated';

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-line-subtle bg-surface">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-ink-secondary">© {new Date().getFullYear()} Sai Vishnu Vamsi Senagasetty</p>
          <p className="mt-2 text-sm text-ink-muted">
            Next.js 14 · Tailwind · Framer Motion ·{' '}
            <a href="/llms.txt" className="link-underline text-accent hover:text-accent-bright">llms.txt</a>
          </p>
          <div className="mt-3"><LastUpdated /></div>
        </div>
      </div>
    </footer>
  );
}
