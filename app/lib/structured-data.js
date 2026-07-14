import { projects } from '../data/projects';
import { allSkills } from '../data/skills';
import { faqItems } from '../data/faq';
import { siteConfig } from './site';

export function getPersonSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.name,
    jobTitle: siteConfig.jobTitle,
    url: siteConfig.url,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Houston',
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    sameAs: [siteConfig.linkedin, siteConfig.github],
    alumniOf: [
      { '@type': 'CollegeOrUniversity', name: 'University of Houston' },
      { '@type': 'CollegeOrUniversity', name: 'SRM University, AP' },
    ],
    knowsAbout: allSkills,
    description: siteConfig.description,
  };
}

export function getProjectsSchema() {
  return projects.map((project) => ({
    '@context': 'https://schema.org',
    '@type': 'SoftwareSourceCode',
    name: project.title,
    description: project.subtitle,
    programmingLanguage: project.techStack.filter((t) =>
      ['Python', 'JavaScript', 'TensorFlow', 'PyTorch', 'R'].includes(t)
    ),
    keywords: [...project.tags, ...project.techStack].join(', '),
    codeRepository: project.github || undefined,
    author: { '@type': 'Person', name: siteConfig.name },
    about: project.goal,
    url: project.github ? project.github : `${siteConfig.url}/#projects`,
  }));
}

export function getFAQSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function getWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.title,
    url: siteConfig.url,
    description: siteConfig.description,
    author: { '@type': 'Person', name: siteConfig.name },
  };
}
