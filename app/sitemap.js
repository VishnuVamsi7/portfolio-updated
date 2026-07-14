import { siteConfig, sectionAnchors } from './lib/site';

export default function sitemap() {
  const base = siteConfig.url;

  const sectionEntries = sectionAnchors.map((section) => ({
    url: `${base}/#${section.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: section.id === 'projects' ? 0.9 : 0.7,
  }));

  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    ...sectionEntries,
  ];
}
