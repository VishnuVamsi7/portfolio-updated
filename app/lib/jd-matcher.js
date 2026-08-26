import { profile, getSkillTaxonomy } from '../data/profile';

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'our', 'will', 'must', 'have',
  'this', 'that', 'from', 'into', 'able', 'work', 'team', 'role', 'job',
  'years', 'year', 'experience', 'required', 'preferred', 'including', 'using',
  'more', 'than', 'over', 'such', 'other', 'across', 'within', 'about',
]);

/** Escape a literal for RegExp. */
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Phrase / token match with boundaries so "R" ≠ every word with "r",
 * and "data" ≠ "datacenter".
 */
function hasPhrase(haystack, phrase) {
  const p = phrase.toLowerCase().trim();
  if (!p) return false;
  const body = escapeRe(p).replace(/\s+/g, '\\s+');
  const re = new RegExp(`(?:^|[^a-z0-9+#._])${body}(?:[^a-z0-9+#._]|$)`, 'i');
  return re.test(haystack);
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ');
}

/** Acronyms / tokens that collide with other domains (e.g. MCP ≠ Model Context Protocol). */
const AMBIGUOUS_SKILLS = {
  mcp: ['model context protocol', 'mcp server', 'mcp servers'],
  r: ['r programming', 'r language', 'rstudio', 'tidyverse'],
  go: ['golang', 'go lang'],
  c: ['c programming', 'embedded c'],
};

/** Terms from taxonomy that may appear in a JD for this skill. */
function searchTermsForSkill(skill, aliases) {
  const sl = skill.toLowerCase();
  if (AMBIGUOUS_SKILLS[sl]) return AMBIGUOUS_SKILLS[sl];

  const terms = new Set([sl]);

  for (const [key, aliasList] of Object.entries(aliases)) {
    if (key === sl) {
      terms.add(key);
      aliasList.forEach((a) => terms.add(a));
    }
    // Listed as an alias of a group: match this skill only — do not inherit siblings
    // (e.g. FastAPI must not mark NestJS just because both sit under "backend").
  }

  return [...terms];
}

function extractJDTerms(jdText) {
  const normalized = normalize(jdText);
  const words = normalized.split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  const unique = new Set(words);

  const { skills, aliases } = getSkillTaxonomy();
  const matchedSkills = [];

  for (const skill of skills) {
    const terms = searchTermsForSkill(skill, aliases);
    if (terms.some((t) => hasPhrase(normalized, t))) {
      matchedSkills.push(skill);
    }
  }

  return {
    terms: [...unique],
    matchedSkills: [...new Set(matchedSkills)],
  };
}

/**
 * Role-domain fit vs an AI/ML engineer profile.
 * Supply-chain PM JDs that only name "AI" as infrastructure get a hard penalty.
 */
function roleFitAdjustment(jdText) {
  const n = normalize(jdText);

  const supplyChain =
    hasPhrase(n, 'supply chain') ||
    hasPhrase(n, 'logistics') ||
    hasPhrase(n, 'procurement') ||
    hasPhrase(n, 'sourcing') ||
    hasPhrase(n, 'demand planning') ||
    hasPhrase(n, 'fulfillment');

  const programMgmt =
    hasPhrase(n, 'program manager') ||
    hasPhrase(n, 'project manager') ||
    hasPhrase(n, 'program management');

  const aiEngRole =
    hasPhrase(n, 'machine learning') ||
    hasPhrase(n, 'ml engineer') ||
    hasPhrase(n, 'ai engineer') ||
    hasPhrase(n, 'ai developer') ||
    hasPhrase(n, 'software engineer') ||
    hasPhrase(n, 'data scientist') ||
    hasPhrase(n, 'llm') ||
    hasPhrase(n, 'rag') ||
    hasPhrase(n, 'full stack') ||
    hasPhrase(n, 'fullstack');

  const heavyScPm = supplyChain && programMgmt && !aiEngRole;
  const lightAiOnly =
    hasPhrase(n, 'ai') &&
    !aiEngRole &&
    (supplyChain || programMgmt);

  if (heavyScPm) return -50;
  if (supplyChain && !aiEngRole) return -40;
  if (programMgmt && !aiEngRole && lightAiOnly) return -35;
  if (aiEngRole) return 8;
  return 0;
}

function scoreProject(project, jdTerms, matchedSkills) {
  let score = 0;
  const reasons = [];
  const corpus = normalize(
    [project.title, project.subtitle, project.goal, project.outcome, ...project.techStack, ...project.tags].join(' ')
  );

  for (const skill of matchedSkills) {
    if (hasPhrase(corpus, skill) || project.techStack.some((t) => hasPhrase(normalize(t), skill))) {
      score += 12;
      reasons.push(`Uses ${skill}`);
    }
  }

  for (const term of jdTerms) {
    if (term.length < 4) continue;
    if (hasPhrase(corpus, term)) score += 2;
  }

  if (
    project.tags.includes('AI') &&
    jdTerms.some((t) => ['ai', 'llm', 'rag', 'ml', 'machine'].includes(t))
  ) {
    score += 8;
    reasons.push('AI/ML aligned');
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 3) };
}

function scoreExperience(exp, jdTerms, matchedSkills) {
  let score = 0;
  const reasons = [];
  const corpus = normalize([exp.title, exp.company, exp.summary, ...exp.skills].join(' '));

  for (const skill of matchedSkills) {
    if (hasPhrase(corpus, skill) || exp.skills.some((s) => hasPhrase(normalize(s), skill))) {
      score += 10;
      reasons.push(`${exp.title}: ${skill}`);
    }
  }

  for (const term of jdTerms) {
    if (term.length < 4) continue;
    if (hasPhrase(corpus, term)) score += 2;
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 2), item: exp };
}

export function matchJD(jdText) {
  const { terms, matchedSkills } = extractJDTerms(jdText);
  const roleAdj = roleFitAdjustment(jdText);

  const projectResults = profile.projects
    .map((project) => {
      const { score, reasons } = scoreProject(project, terms, matchedSkills);
      return { type: 'project', id: project.id, title: project.title, score, reasons };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const experienceResults = profile.experience
    .map((exp) => scoreExperience(exp, terms, matchedSkills))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);

  const topProjects = projectResults.slice(0, 3);
  const topExperience = experienceResults.slice(0, 2);

  const projectPts = topProjects.reduce((s, p) => s + p.score, 0);
  const expPts = topExperience.reduce((s, e) => s + e.score, 0);
  // Reward real skill hits, but don't let a handful of generic tools (SQL, Excel-adjacent) dominate.
  const skillPts = matchedSkills.length * 4;

  const raw = projectPts * 0.35 + expPts * 0.25 + skillPts * 0.4;
  // Normalize against a realistic “strong AI eng JD” envelope (~120).
  let matchScore = Math.round((raw / 120) * 100) + roleAdj;
  matchScore = Math.max(5, Math.min(95, matchScore));

  // Hard ceiling when domain is clearly wrong (e.g. Principal Supply Chain PM).
  if (roleAdj <= -40) matchScore = Math.min(matchScore, 28);
  else if (roleAdj <= -30) matchScore = Math.min(matchScore, 40);

  const topSkills = matchedSkills.slice(0, 6);
  const pitch = generatePitch(matchScore, topSkills, topProjects, roleAdj);

  return {
    matchScore,
    pitch,
    matchedSkills: topSkills,
    missingSkills: findMissingSkills(matchedSkills, jdText),
    projects: topProjects,
    experience: topExperience.map((e) => ({
      id: e.item.id,
      title: e.item.title,
      company: e.item.company,
      score: e.score,
      reasons: e.reasons,
    })),
    roleFit: roleAdj,
  };
}

function findMissingSkills(found, jdText) {
  const n = normalize(jdText);
  const core = ['Python', 'Machine Learning', 'RAG', 'TensorFlow', 'PyTorch', 'Docker', 'FastAPI', 'TypeScript'];
  return core.filter((s) => !found.includes(s) && hasPhrase(n, s.toLowerCase())).slice(0, 4);
}

function generatePitch(score, skills, topProjects, roleAdj) {
  const skillStr = skills.length ? skills.slice(0, 4).join(', ') : 'AI, ML, and software engineering';
  const projectStr = topProjects[0]?.title || 'end-to-end AI/ML projects';

  if (roleAdj <= -40 || score < 35) {
    return `Weak fit for this role. The JD targets supply-chain / program leadership more than hands-on AI engineering. Sai Vishnu Vamsi Senagasetty is strongest as an AI Developer (RAG, FastAPI, LLM backends)—overlap is limited to transferable tools like ${skillStr || 'data/automation fundamentals'}, not the core job scope.`;
  }
  if (score >= 75) {
    return `Strong fit. Sai Vishnu Vamsi Senagasetty brings direct experience in ${skillStr}, with flagship work on ${projectStr}. He ships production RAG systems, model deployment pipelines, and full-stack AI products recruiters can evaluate live on this portfolio.`;
  }
  if (score >= 55) {
    return `Good fit. Core overlap in ${skillStr} maps to ${projectStr} and related ML work. Sai combines graduate-level CS training (University of Houston) with hands-on LLM, NLP, and deployment experience.`;
  }
  if (score >= 35) {
    return `Partial fit with transferable strengths in ${skillStr}. Sai Vishnu Vamsi Senagasetty is an AI/ML engineer who learns fast—see ${projectStr} and the live RAG assistant for proof of delivery.`;
  }
  return `Limited fit. This role’s primary requirements sit outside Sai’s AI/ML engineering focus. Relevant bridges: ${skillStr}. Strongest evidence remains ${projectStr} and production RAG delivery at Zibtek.`;
}

export async function enhancePitchWithLLM(jdText, baseResult) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return baseResult;
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // llama-3.1-8b-instant was decommissioned on Groq (Aug 16, 2026)
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        messages: [
          {
            role: 'system',
            content:
              'You write concise recruiter pitches in 2-3 sentences. Use only facts provided. No fabrication. If matchScore is under 40 or the JD is a poor domain fit (e.g. supply chain PM vs AI engineer), say the fit is weak and do not claim strong alignment.',
          },
          {
            role: 'user',
            content: `JD excerpt: ${jdText.slice(0, 1500)}\n\nMatch score: ${baseResult.matchScore}/100\nCandidate skills hit: ${baseResult.matchedSkills.join(', ') || 'none'}\nTop projects: ${baseResult.projects.map((p) => p.title).join('; ') || 'none'}\nBase pitch: ${baseResult.pitch}\n\nRewrite pitch only.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) return baseResult;
    const data = await response.json();
    const enhanced = data.choices?.[0]?.message?.content?.trim();
    if (enhanced) return { ...baseResult, pitch: enhanced, enhancedByLLM: true };
  } catch {
    // fall through to base result
  }

  return baseResult;
}
