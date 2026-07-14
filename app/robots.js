import { siteConfig } from './lib/site';

const AI_CRAWLERS = [
  'GPTBot',
  'ClaudeBot',
  'PerplexityBot',
  'Google-Extended',
  'CCBot',
  'Bytespider',
  'anthropic-ai',
  'Applebot-Extended',
];

export default function robots() {
  const allowAI = AI_CRAWLERS.map((bot) => ({
    userAgent: bot,
    allow: '/',
  }));

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
      ...allowAI,
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
