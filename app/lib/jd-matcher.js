import { profile, getSkillTaxonomy } from '../data/profile';

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'our', 'will', 'must', 'have',
  'this', 'that', 'from', 'into', 'able', 'work', 'team', 'role', 'job',
  'years', 'year', 'experience', 'required', 'preferred', 'including', 'using',
]);

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, ' ');
}

function extractJDTerms(jdText) {
  const normalized = normalize(jdText);
  const words = normalized.split(/\s+/).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
  const unique = new Set(words);

  const { skills, aliases } = getSkillTaxonomy();
  const matchedSkills = [];

  for (const skill of skills) {
    const skillLower = skill.toLowerCase();
    if (normalized.includes(skillLower)) {
      matchedSkills.push(skill);
      continue;
    }
    for (const [, aliasList] of Object.entries(aliases)) {
      if (aliasList.some((a) => skillLower.includes(a) || a.includes(skillLower))) {
        if (aliasList.some((a) => normalized.includes(a))) {
          matchedSkills.push(skill);
          break;
        }
      }
    }
  }

  for (const [key, aliasList] of Object.entries(aliases)) {
    if (aliasList.some((a) => normalized.includes(a))) {
      const related = skills.filter((s) => normalize(s).includes(key) || key.includes(normalize(s)));
      related.forEach((s) => matchedSkills.push(s));
    }
  }

  return {
    terms: [...unique],
    matchedSkills: [...new Set(matchedSkills)],
  };
}

function scoreProject(project, jdTerms, matchedSkills) {
  let score = 0;
  const reasons = [];
  const corpus = normalize(
    [project.title, project.subtitle, project.goal, project.outcome, ...project.techStack, ...project.tags].join(' ')
  );

  for (const skill of matchedSkills) {
    if (corpus.includes(normalize(skill))) {
      score += 12;
      reasons.push(`Uses ${skill}`);
    }
  }

  for (const term of jdTerms) {
    if (corpus.includes(term)) {
      score += 4;
    }
  }

  if (project.tags.includes('AI') && jdTerms.some((t) => ['ai', 'llm', 'rag', 'ml'].includes(t))) {
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
    if (corpus.includes(normalize(skill))) {
      score += 10;
      reasons.push(`${exp.title}: ${skill}`);
    }
  }

  for (const term of jdTerms) {
    if (corpus.includes(term)) score += 3;
  }

  return { score, reasons: [...new Set(reasons)].slice(0, 2), item: exp };
}

export function matchJD(jdText) {
  const { terms, matchedSkills } = extractJDTerms(jdText);

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

  const maxPossible = Math.max(matchedSkills.length * 12 + 20, 40);
  const rawScore =
    topProjects.reduce((s, p) => s + p.score, 0) +
    topExperience.reduce((s, e) => s + e.score, 0) +
    matchedSkills.length * 5;
  const matchScore = Math.min(98, Math.max(25, Math.round((rawScore / maxPossible) * 100)));

  const topSkills = matchedSkills.slice(0, 6);
  const pitch = generatePitch(matchScore, topSkills, topProjects);

  return {
    matchScore,
    pitch,
    matchedSkills: topSkills,
    missingSkills: findMissingSkills(matchedSkills),
    projects: topProjects,
    experience: topExperience.map((e) => ({
      id: e.item.id,
      title: e.item.title,
      company: e.item.company,
      score: e.score,
      reasons: e.reasons,
    })),
  };
}

function findMissingSkills(found) {
  const core = ['Python', 'Machine Learning', 'RAG', 'TensorFlow', 'PyTorch', 'Docker'];
  return core.filter((s) => !found.includes(s)).slice(0, 3);
}

function generatePitch(score, skills, topProjects) {
  const skillStr = skills.length ? skills.slice(0, 4).join(', ') : 'AI, ML, and software engineering';
  const projectStr = topProjects[0]?.title || 'end-to-end AI/ML projects';

  if (score >= 80) {
    return `Strong fit. Sai Vishnu Vamsi Senagasetty brings direct experience in ${skillStr}, with flagship work on ${projectStr}. He ships production RAG systems, model deployment pipelines, and full-stack AI products recruiters can evaluate live on this portfolio.`;
  }
  if (score >= 60) {
    return `Good fit. Core overlap in ${skillStr} maps to ${projectStr} and related ML work. Sai combines graduate-level CS training (University of Houston) with hands-on LLM, NLP, and deployment experience.`;
  }
  return `Partial fit with transferable strengths in ${skillStr}. Sai Vishnu Vamsi Senagasetty is an AI/ML engineer who learns fast—see ${projectStr} and the live RAG assistant for proof of delivery.`;
}

export async function enhancePitchWithLLM(jdText, baseResult) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) return baseResult;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content:
              'You write concise recruiter pitches in 2-3 sentences. Use only facts provided. No fabrication.',
          },
          {
            role: 'user',
            content: `JD excerpt: ${jdText.slice(0, 1500)}\n\nCandidate skills: ${baseResult.matchedSkills.join(', ')}\nTop projects: ${baseResult.projects.map((p) => p.title).join('; ')}\nBase pitch: ${baseResult.pitch}\n\nRewrite pitch only.`,
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
