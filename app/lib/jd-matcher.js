/**
 * JD matcher — the JD crew (Tier 2).
 *
 * Pipeline: Extractor (deterministic) -> Scorer (deterministic) ->
 * Writer (template pitch) -> Critic (deterministic) -> optional LLM
 * pitch enhancement that only ever sees the SCORED TABLE, never the raw JD
 * (a JD is untrusted text; feeding it to an LLM is a prompt-injection
 * surface — see the review §5.3).
 *
 * The score is DERIVED from the per-requirement table (share of required
 * requirements evidenced), never a magic denominator. A JD that requires
 * PyTorch scores low, because PyTorch is exposure-tier: familiar, not
 * production — it can never satisfy a requirement.
 */
import { profile, getSkillTaxonomy } from '../data/profile';
import { getSkillTier } from '../data/skills';

const STOP_WORDS = new Set([
  'the', 'and', 'for', 'with', 'you', 'your', 'our', 'will', 'must', 'have',
  'this', 'that', 'from', 'into', 'able', 'work', 'team', 'role', 'job',
  'years', 'year', 'experience', 'required', 'preferred', 'including', 'using',
  'more', 'than', 'over', 'such', 'other', 'across', 'within', 'about',
]);

/** Professional experience, earliest role Jan 2024 (NLP Research Assistant). */
const PROFILE_YEARS = 2.8;
const PROFILE_YEARS_NOTE = '2.8 yrs professional experience (since Jan 2024)';

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
  const exposureSkills = [];

  for (const skill of skills) {
    const terms = searchTermsForSkill(skill, aliases);
    if (terms.some((t) => hasPhrase(normalized, t))) {
      // Exposure-tier skills are mentioned, not mastered: they never score
      // match points and never appear in pitches as experience. They are
      // reported separately so the UI can show them as gaps.
      if (getSkillTier(skill) === 'exposure') exposureSkills.push(skill);
      else matchedSkills.push(skill);
    }
  }

  return {
    terms: [...unique],
    matchedSkills: [...new Set(matchedSkills)],
    exposureSkills: [...new Set(exposureSkills)],
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

// ---------------------------------------------------------------------------
// JD crew: extractor -> scorer -> writer -> critic
// ---------------------------------------------------------------------------

const SECTION_HEADERS = {
  // NOTE: "Required Qualifications:" must match here. It previously did
  // not (the pattern only knew "Requirements"/"Required Skills"), so a JD
  // using that heading — e.g. Lenovo WD00106424 — had its whole Required
  // section silently skipped and scored 28% on the Preferred section alone.
  required: /^(requirements?|required(\s+(qualifications?|skills?|experience))?|qualifications?|what you('ll| will) (bring|need)|what we('re| are) looking for|must[- ]have|essential|minimum qualifications?)/i,
  preferred: /^(preferred|nice[- ]to[- ]have|bonus|plus|desired|ideal|preferred qualifications?)/i,
  responsibilities: /^(responsibilities|what you('ll| will) do|day[- ]to[- ]day|about the role|the role)/i,
};

/**
 * Lines that are boilerplate, not requirements — they must never become
 * scored rows. EEO paragraphs and bare location lists ("United States of
 * America - North Carolina - Morrisville") previously scored as preferred
 * gaps, dragging the Lenovo score down for no reason.
 */
function isBoilerplate(line) {
  const n = normalize(line);
  if (/equal opportunity|do not discriminate|discrimination/i.test(line)) return true;
  if (/encouraged to apply/i.test(line)) return true;
  if (/^additional locations?/i.test(line)) return true;
  // Bare location list with no requirement verb and no remote/hybrid/onsite
  // mode: "United States of America - North Carolina - Morrisville".
  if (
    /^(united states of america|usa|u\.?s\.?)\b/i.test(line) &&
    !/\b(remote|hybrid|onsite|on-site|relocat)/i.test(line) &&
    !/\b(python|rag|ai|ml|cloud|engineer|developer)\b/i.test(line)
  ) {
    return true;
  }
  return false;
}

/**
 * A requirement that asks only for familiarity / basic knowledge / exposure
 * is satisfied by familiarity — it must NOT be scored as a production
 * requirement. Exposure-tier skills (PyTorch, TensorFlow) are gaps only
 * when the JD asks for production work in them, never when it asks for
 * "familiarity with" them.
 */
const FAMILIARITY_RE = /\b(familiarity with|familiar with|basic (knowledge|understanding)|exposure to|awareness of|understanding of|knowledge of)\b/i;

const YEARS_RE = /(\d+)\s*\+?\s*(?:years?|yrs?)\b/i;
const DEGREE_RE = /\b(ph\.?d\.?|master'?s|bachelor'?s|b\.?s\.?|m\.?s\.?|degree)\b/i;

/** Split a JD into { section, lines[] } by headers; lines before any header are "intro". */
function splitSections(jdText) {
  const sections = [{ section: 'intro', lines: [] }];
  for (const raw of jdText.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const header = line.replace(/[:\s]+$/, '');
    if (SECTION_HEADERS.required.test(header)) {
      sections.push({ section: 'required', lines: [] });
      continue;
    }
    if (SECTION_HEADERS.preferred.test(header)) {
      sections.push({ section: 'preferred', lines: [] });
      continue;
    }
    if (SECTION_HEADERS.responsibilities.test(header)) {
      sections.push({ section: 'responsibilities', lines: [] });
      continue;
    }
    sections[sections.length - 1].lines.push(line);
  }
  return sections;
}

function cleanBullet(line) {
  return line.replace(/^[-*•·\d]+[.)\s]*/, '').trim();
}

/** Skills mentioned in one requirement line (taxonomy terms only). */
function skillsInLine(line, aliases) {
  const { skills } = getSkillTaxonomy();
  const n = normalize(line);
  return skills.filter((s) => searchTermsForSkill(s, aliases).some((t) => hasPhrase(n, t)));
}

function classifyRowKind(line, skills) {
  if (YEARS_RE.test(line)) return 'years';
  if (DEGREE_RE.test(line)) return 'degree';
  if (/\b(remote|hybrid|onsite|on-site|relocat)/i.test(line)) return 'location';
  if (/\b(senior|staff|principal|junior|entry[- ]level|mid[- ]level)\b/i.test(line)) return 'seniority';
  if (skills.length) return 'skill';
  return 'other';
}

/**
 * Extractor (deterministic): parse the JD into requirement rows.
 * Each row: { text, required, kind, skills, years }.
 * Falls back to one row per matched skill when the JD has no parseable
 * requirements section (e.g. a pasted skill list).
 */
function extractRequirements(jdText, { matchedSkills, exposureSkills }) {
  const { aliases } = getSkillTaxonomy();
  const rows = [];
  const seen = new Set();

  const pushRow = (text, required, source) => {
    const clean = cleanBullet(text).slice(0, 220);
    const key = normalize(clean);
    if (!clean || clean.length < 4 || seen.has(key)) return;
    if (isBoilerplate(clean)) return;
    seen.add(key);
    // A "preferred" item listed inside the Requirements section is still preferred.
    if (/\b(preferred|nice[- ]to[- ]have|bonus|a plus)\b/i.test(clean)) required = false;
    const skills = skillsInLine(clean, aliases);
    rows.push({
      text: clean,
      required,
      kind: classifyRowKind(clean, skills),
      skills,
      years: (clean.match(YEARS_RE) || [])[1] ? parseInt(clean.match(YEARS_RE)[1], 10) : null,
      source,
    });
  };

  for (const { section, lines } of splitSections(jdText)) {
    if (section === 'intro' || section === 'responsibilities') continue;
    const required = section === 'required';
    for (const line of lines) {
      // Bullet lines are rows; long paragraphs split into sentences.
      if (/^[-*•·]/.test(line) || /^\d+[.)]/.test(line)) {
        pushRow(line, required, section);
      } else {
        for (const sentence of line.split(/(?<=[.!?])\s+/)) {
          if (sentence.length > 25) pushRow(sentence, required, section);
        }
      }
    }
  }

  if (!rows.length) {
    // No requirements section — one row per skill the JD names.
    for (const s of [...matchedSkills, ...exposureSkills]) {
      rows.push({ text: s, required: true, kind: 'skill', skills: [s], years: null, source: 'skill-list' });
    }
  }

  // Keep the table readable: required rows first, then preferred, max 14.
  const ordered = [
    ...rows.filter((r) => r.required),
    ...rows.filter((r) => !r.required),
  ];
  return ordered.slice(0, 14);
}

/** Find the best evidence (project or role) that shows a skill being used. */
function evidenceForSkill(skill, projectResults, experienceResults) {
  const n = skill.toLowerCase();
  const proj = projectResults.find(
    (p) =>
      p.reasons.some((r) => r.toLowerCase().includes(n)) ||
      hasPhrase(normalize(p.title), n)
  );
  if (proj) return { type: 'project', name: proj.title };
  const exp = experienceResults.find((e) =>
    e.reasons.some((r) => r.toLowerCase().includes(n))
  );
  // experienceResults carry the role under `.item`, not at top level —
  // using exp.title directly rendered "undefined @ undefined" in the table.
  if (exp) return { type: 'role', name: `${exp.item.title} @ ${exp.item.company}` };
  return null;
}

/**
 * Evidence for a generic (non-skill) requirement row, from real profile
 * text — not from the JD's words alone. Returns null when nothing in the
 * profile supports the row, so unsupported rows still score as gaps.
 * Previously every 'other' row scored as a gap, so "internship / research
 * experience" and "AI projects" failed even though the profile holds a
 * Handshake research fellowship, an NLP research assistantship, and
 * production RAG projects.
 */
function genericRowEvidence(rowText) {
  const t = rowText.toLowerCase();
  // Title only: "Fellow" alone (e.g. Software Engineering Fellow) is not
  // research experience — Handshake "AI Researcher Fellow" and Grandios
  // "AI Research Intern" are, and they must win over the Fellow title.
  const researchRole = profile.experience.find((e) =>
    /research|intern/i.test(e.title)
  );
  if (/\b(internship|research|academic project)\b/.test(t) && researchRole) {
    return {
      status: 'evidenced',
      evidence: [`${researchRole.title} @ ${researchRole.company}`],
      note: 'research / internship experience in profile',
    };
  }
  if (/\b(rpa|robotic process automation)\b/.test(t)) {
    const automation = profile.projects.find((p) =>
      /automat|agent/i.test(`${p.title} ${p.goal || ''} ${p.outcome || ''}`)
    );
    if (automation) {
      return {
        status: 'partial',
        evidence: [automation.title],
        note: 'workflow automation + AI agents evidenced; RPA tools (e.g. UiPath) not in profile',
      };
    }
    return null;
  }
  if (/\b(apis?|data pipelines?)\b/.test(t)) {
    const apiRole = profile.experience.find((e) =>
      (e.skills || []).some((s) => /fastapi|rest apis/i.test(s))
    );
    if (apiRole) {
      return {
        status: 'evidenced',
        evidence: [`${apiRole.title} @ ${apiRole.company}`],
        note: 'FastAPI / API delivery in profile',
      };
    }
    return null;
  }
  if (/\b(ai projects?|automation solutions?|process improvement)\b/.test(t)) {
    const project = profile.projects.find((p) => /rag|ai/i.test(p.title));
    if (project) {
      return {
        status: 'evidenced',
        evidence: [project.title],
        note: 'production AI projects in profile',
      };
    }
    return null;
  }
  if (/\b(collaborat|cross-functional|teamwork)\b/.test(t)) {
    return {
      status: 'partial',
      evidence: [],
      note: 'team-based delivery roles in profile; soft skill, not directly evidenced',
    };
  }
  return null;
}

/**
 * Scorer (deterministic): one verdict per requirement.
 * status: 'evidenced' (1.0) | 'partial' (0.5) | 'gap' (0).
 * An exposure-tier skill can never satisfy a PRODUCTION requirement — it
 * is a gap by construction, which is what fixes the PyTorch JD scoring
 * 62-68. But when the JD asks only for familiarity / basic knowledge /
 * exposure, familiarity satisfies it (Lenovo WD00106424); scoring that as
 * a gap was the second Lenovo bug.
 */
function scoreRequirements(rows, projectResults, experienceResults, matchedSkills, roleAdj) {
  const table = [];
  for (const row of rows) {
    let status = 'gap';
    let evidence = [];
    let note = '';

    if (row.kind === 'skill') {
      const familiarityOnly = FAMILIARITY_RE.test(row.text);
      const verdicts = row.skills.map((skill) => {
        if (getSkillTier(skill) === 'exposure') {
          if (familiarityOnly) {
            return {
              skill,
              status: 'evidenced',
              note: 'familiarity — JD asks for familiarity, not production',
            };
          }
          return { skill, status: 'gap', note: 'familiar, not production' };
        }
        if (!matchedSkills.includes(skill)) {
          return { skill, status: 'gap', note: 'not in profile' };
        }
        const ev = evidenceForSkill(skill, projectResults, experienceResults);
        return { skill, status: 'evidenced', evidence: ev ? ev.name : null };
      });
      const ok = verdicts.filter((v) => v.status === 'evidenced');
      const bad = verdicts.filter((v) => v.status === 'gap');
      if (verdicts.length && ok.length === verdicts.length) status = 'evidenced';
      else if (ok.length) status = 'partial';
      evidence = ok.map((v) => v.evidence).filter(Boolean);
      note = bad.map((v) => `${v.skill}: ${v.note}`).join('; ');
      if (!note && familiarityOnly) {
        const fam = ok.filter((v) => v.note).map((v) => `${v.skill}: ${v.note}`).join('; ');
        if (fam) note = fam;
      }
      if (!row.skills.length) {
        status = 'gap';
        note = 'no recognized skill in this requirement';
      }
    } else if (row.kind === 'years' && row.years != null) {
      if (row.years <= 2) {
        status = 'evidenced';
        note = PROFILE_YEARS_NOTE;
      } else if (row.years <= 5) {
        status = 'partial';
        note = `${PROFILE_YEARS_NOTE} — below the ${row.years}-year ask`;
      } else {
        status = 'gap';
        note = `${PROFILE_YEARS_NOTE} — well below the ${row.years}-year ask`;
      }
    } else if (row.kind === 'degree') {
      if (/\bph\.?d\.?\b/i.test(row.text)) {
        status = 'gap';
        note = 'highest degree is an MS in Computer Science';
      } else {
        status = 'evidenced';
        note = 'MS Computer Science, University of Houston';
      }
    } else if (row.kind === 'location') {
      if (/\bremote\b/i.test(row.text)) {
        status = 'evidenced';
        note = 'open to remote work';
      } else if (/\bhybrid\b/i.test(row.text) || /\bhouston\b/i.test(row.text)) {
        status = 'evidenced';
        note = 'based in Houston, open to hybrid';
      } else if (/\bonsite|on-site\b/i.test(row.text)) {
        status = 'gap';
        note = 'based in Houston — onsite elsewhere needs relocation';
      } else {
        status = 'partial';
        note = 'location terms unclear';
      }
    } else if (row.kind === 'seniority') {
      if (/\b(junior|entry[- ]level|associate)\b/i.test(row.text)) {
        status = 'evidenced';
        note = PROFILE_YEARS_NOTE;
      } else if (/\bmid[- ]level\b/i.test(row.text)) {
        status = 'evidenced';
        note = PROFILE_YEARS_NOTE;
      } else if (/\bsenior\b/i.test(row.text)) {
        status = 'partial';
        note = `${PROFILE_YEARS_NOTE} — senior roles usually expect 5+ years`;
      } else {
        status = 'gap';
        note = `${PROFILE_YEARS_NOTE} — staff/principal is above current level`;
      }
    } else {
      // 'other' rows: check real profile evidence for generic phrasing
      // (research/internship, AI projects, APIs/pipelines, RPA, teamwork)
      // before falling back to a gap.
      const generic = genericRowEvidence(row.text);
      if (generic) {
        status = generic.status;
        evidence = generic.evidence;
        note = generic.note;
      } else {
        status = 'gap';
        note = 'no direct evidence in profile';
      }
    }

    table.push({ ...row, status, evidence: [...new Set(evidence)].slice(0, 2), note });
  }

  // Domain row: the role-fit check as one more requirement.
  table.push({
    text: 'Role domain: AI/ML engineering',
    required: true,
    kind: 'domain',
    skills: [],
    years: null,
    source: 'domain',
    status: roleAdj >= 8 ? 'evidenced' : roleAdj <= -30 ? 'gap' : 'partial',
    evidence: roleAdj >= 8 ? ['AI Developer @ Zibtek'] : [],
    note:
      roleAdj >= 8
        ? 'AI/ML engineering role — matches this profile'
        : roleAdj <= -30
          ? 'outside AI/ML engineering — see role-fit note'
          : 'mixed domain',
  });

  return table;
}

/** Score derived from the table: weighted share of requirements evidenced. */
function deriveScore(table) {
  let total = 0;
  let earned = 0;
  let reqTotal = 0;
  let reqEarned = 0;
  for (const row of table) {
    const weight = row.required ? 1 : 0.5;
    const value = row.status === 'evidenced' ? 1 : row.status === 'partial' ? 0.5 : 0;
    total += weight;
    earned += weight * value;
    if (row.required) {
      reqTotal += 1;
      reqEarned += value;
    }
  }
  const score = total ? Math.round((earned / total) * 100) : 0;
  return {
    score: Math.max(5, Math.min(95, score)),
    breakdown: {
      requiredEvidenced: reqEarned,
      requiredTotal: reqTotal,
      weightedEarned: Math.round(earned * 10) / 10,
      weightedTotal: total,
    },
  };
}

/**
 * Flags the recruiter (and Vishnu) should see before trusting the score:
 * roles his own job-search rules say to skip.
 */
function extractFlags(jdText) {
  const n = normalize(jdText);
  const flags = [];
  if (hasPhrase(n, 'us citizen') || hasPhrase(n, 'u.s. citizen') || hasPhrase(n, 'us citizenship')) {
    flags.push({
      type: 'citizenship-required',
      message: 'This role requires U.S. citizenship — per your job-search rules, skip it.',
    });
  }
  if (hasPhrase(n, 'security clearance') || hasPhrase(n, 'clearance required')) {
    flags.push({
      type: 'clearance-required',
      message: 'This role requires a security clearance — per your job-search rules, skip it.',
    });
  }
  if (hasPhrase(n, 'no sponsorship') || hasPhrase(n, 'will not sponsor') || hasPhrase(n, 'cannot sponsor')) {
    flags.push({
      type: 'no-sponsorship',
      message: 'This employer does not sponsor — you will need sponsorship in the future.',
    });
  }
  return flags;
}

export function matchJD(jdText) {
  const { terms, matchedSkills, exposureSkills } = extractJDTerms(jdText);
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

  // JD crew: extract -> score -> derive.
  const rows = extractRequirements(jdText, { matchedSkills, exposureSkills });
  const requirements =
    rows.length === 0
      ? [
          {
            text: 'No clear requirements found in the pasted text',
            required: true,
            kind: 'other',
            skills: [],
            years: null,
            source: 'none',
            status: 'gap',
            evidence: [],
            note: 'Paste the Requirements section for a real evaluation.',
          },
        ]
      : scoreRequirements(rows, projectResults, experienceResults, matchedSkills, roleAdj);
  const { score: derived, breakdown } = deriveScore(requirements);
  let matchScore = derived;
  // A required core skill he only has exposure to (PyTorch, TF, K8s) can
  // never be a good fit, however many other rows match: cap at 45.
  // "Not evidenced" includes partial rows: a row like "Production
  // PyTorch + Deep Learning" scores partial on Deep Learning while its
  // PyTorch verdict is still a gap, and the old status === 'gap' check
  // let that bypass the cap entirely (67% on a PyTorch-required JD).
  // Familiarity rows that score evidenced are exempt by construction.
  const exposureGap = requirements.some(
    (r) =>
      r.required &&
      r.kind === 'skill' &&
      r.status !== 'evidenced' &&
      (r.skills || []).some((s) => getSkillTier(s) === 'exposure')
  );
  if (exposureGap && matchScore > 45) {
    matchScore = 45;
    breakdown.capped = 'required exposure-tier skill missing (e.g. PyTorch)';
  }
  // Hard ceiling when domain is clearly wrong (e.g. Principal Supply Chain PM).
  if (roleAdj <= -40) matchScore = Math.min(matchScore, 28);
  else if (roleAdj <= -30) matchScore = Math.min(matchScore, 40);

  const evidencedSkills = [
    ...new Set(
      requirements
        .filter((r) => r.status === 'evidenced')
        .flatMap((r) => r.skills)
        .filter((s) => getSkillTier(s) !== 'exposure')
    ),
  ];
  const topSkills = (evidencedSkills.length ? evidencedSkills : matchedSkills).slice(0, 6);
  const pitch = generatePitch(matchScore, topSkills, topProjects, roleAdj);

  return {
    matchScore,
    pitch,
    matchedSkills: topSkills,
    exposureSkills,
    missingSkills: findMissingSkills(matchedSkills, jdText, requirements),
    projects: topProjects,
    experience: topExperience.map((e) => ({
      id: e.item.id,
      title: e.item.title,
      company: e.item.company,
      score: e.score,
      reasons: e.reasons,
    })),
    roleFit: roleAdj,
    requirements,
    scoreBreakdown: breakdown,
    flags: extractFlags(jdText),
  };
}

function findMissingSkills(found, jdText, requirements = []) {
  const n = normalize(jdText);
  const core = ['Python', 'Machine Learning', 'RAG', 'TensorFlow', 'PyTorch', 'Docker', 'FastAPI', 'TypeScript'];
  // "Machine Learning" is not a taxonomy entry, so it can never be "found"
  // directly; count it as covered when the JD already matched a real ML skill.
  const mlCovered = ['Deep Learning', 'Scikit-learn', 'Model Tuning', 'Reinforcement Learning'].some((s) =>
    found.includes(s)
  );
  // A skill the requirement table marks evidenced/partial (e.g. PyTorch
  // under a "familiarity with" row) is NOT a gap, even though it is
  // exposure-tier and therefore never in `found`. Without this, the
  // Lenovo JD listed TensorFlow/PyTorch as "Gaps to note" while the same
  // page marked their row evidenced.
  const tableSatisfied = new Set(
    (requirements || [])
      .filter((r) => r.status === 'evidenced' || r.status === 'partial')
      .flatMap((r) => r.skills || [])
  );
  return core
    .filter((s) => {
      if (s === 'Machine Learning' && mlCovered) return false;
      if (tableSatisfied.has(s)) return false;
      return !found.includes(s) && hasPhrase(n, s.toLowerCase());
    })
    .slice(0, 4);
}

function generatePitch(score, skills, topProjects, roleAdj) {
  const skillStr = skills.length ? skills.slice(0, 4).join(', ') : 'AI, ML, and software engineering';
  const projectStr = topProjects[0]?.title || 'end-to-end AI/ML projects';

  if (roleAdj <= -40 || score < 35) {
    if (roleAdj <= -30) {
      return `Weak fit for this role. The JD targets supply-chain / program leadership more than hands-on AI engineering. Sai Vishnu Vamsi Senagasetty is strongest as an AI Developer (RAG, FastAPI, LLM backends)—overlap is limited to transferable tools like ${skillStr || 'data/automation fundamentals'}, not the core job scope.`;
    }
    return `Weak fit for this role. The core requirements sit outside Sai Vishnu Vamsi Senagasetty's demonstrated experience — see the requirement table for the gaps. His strongest evidence remains ${projectStr} and production RAG delivery at Zibtek.`;
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

/**
 * Critic (deterministic): the pitch may only claim skills the table marks
 * evidenced. If it names an exposure-tier skill, or any skill the table
 * does not evidence, the pitch fails and the caller falls back to the
 * template pitch.
 */
function criticCheckPitch(pitch, requirements) {
  const evidenced = new Set(
    requirements
      .filter((r) => r.status === 'evidenced')
      .flatMap((r) => r.skills)
  );
  const { skills } = getSkillTaxonomy();
  const issues = [];
  for (const skill of skills) {
    if (!hasPhrase(pitch, skill.toLowerCase())) continue;
    if (getSkillTier(skill) === 'exposure') {
      issues.push(`pitch claims exposure skill "${skill}" as experience`);
    } else if (!evidenced.has(skill)) {
      issues.push(`pitch claims "${skill}" without table evidence`);
    }
  }
  return { ok: issues.length === 0, issues };
}

/**
 * LLM pitch enhancement — receives ONLY the scored requirement table, never
 * the raw JD (untrusted text). Falls back silently to the template pitch
 * when no Groq key is configured, and the critic rejects any enhanced
 * pitch that overclaims.
 */
export async function enhancePitchWithLLM(requirements, baseResult) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || !apiKey.startsWith('gsk_')) {
    return baseResult;
  }

  const tableText = (requirements || [])
    .map(
      (r) =>
        `- [${r.status}] ${r.required ? 'REQUIRED' : 'preferred'}: ${r.text} (evidence: ${(r.evidence || []).join('; ') || 'none'})`
    )
    .join('\n');

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
              'You write concise recruiter pitches in 2-3 sentences. Use only facts in the requirement table provided. Mention ONLY requirements marked [evidenced]. Never claim a skill marked [gap] or [partial] as experience. If the score is under 40, say the fit is weak.',
          },
          {
            role: 'user',
            content: `Match score: ${baseResult.matchScore}/100\nRequirement table:\n${tableText}\n\nBase pitch: ${baseResult.pitch}\n\nRewrite pitch only.`,
          },
        ],
        max_tokens: 200,
        temperature: 0.3,
      }),
    });

    if (!response.ok) return baseResult;
    const data = await response.json();
    const enhanced = data.choices?.[0]?.message?.content?.trim();
    if (!enhanced) return baseResult;
    const check = criticCheckPitch(enhanced, requirements || []);
    if (!check.ok) return { ...baseResult, pitchChecked: true, pitchIssues: check.issues };
    return { ...baseResult, pitch: enhanced, enhancedByLLM: true, pitchChecked: true };
  } catch {
    // fall through to base result
  }

  return baseResult;
}
