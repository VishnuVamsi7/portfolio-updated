import './globals.css';
import { Inter, Space_Grotesk } from 'next/font/google';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { siteConfig } from './lib/site';
import {
  getPersonSchema,
  getProjectsSchema,
  getFAQSchema,
  getWebSiteSchema,
} from './lib/structured-data';

const jsonLd = [
  getWebSiteSchema(),
  getPersonSchema(),
  ...getProjectsSchema(),
  getFAQSchema(),
];

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: false,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  preload: false,
});

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: {
    canonical: siteConfig.url,
  },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: ['/opengraph-image'],
  },
  other: {
    'theme-color': '#0A0B0E',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable site summary" />
        <link
          rel="preload"
          as="image"
          href="/assets/silhouette-transparent.webp?v=3"
          type="image/webp"
          fetchPriority="high"
        />
        {/* Cover the page before React hydrates so the hero never flashes first */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(sessionStorage.getItem('introPlayed')==='true')return;if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;document.documentElement.classList.add('intro-pending');}catch(e){}})();`,
          }}
        />
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} min-h-screen flex flex-col font-body`}
      >
        <div
          id="intro-boot-scrim"
          className="intro-boot-scrim"
          aria-hidden="true"
        >
          <div className="intro-boot-aura" />
          <canvas
            width="720"
            height="720"
            className="intro-boot-image"
            aria-hidden="true"
          />
          <div className="intro-boot-copy">
            <p
              className="text-4xl font-extrabold tracking-tight text-ink-primary sm:text-5xl md:text-6xl"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              Vishnu S
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.28em] text-accent-bright sm:text-xs">
              AI Developer
            </p>
          </div>
        </div>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
