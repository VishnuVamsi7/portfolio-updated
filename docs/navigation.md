# Portfolio v2 — Wormhole Journey Spec

> Driving doc for the Figma → MCP → Copilot → Netlify pipeline.
> Figma gives the look, this doc gives the behavior. Copilot reads both.

## Concept

One continuous scroll journey through a "universe": the visitor starts in a
starfield (hero), travels through a wormhole tunnel, and the wormhole **forks**
— one branch per project category, one region of constellations per skill
family — before emerging into calm for contact.

**Architecture (non-negotiable):**
- One fixed full-screen WebGL canvas (`WormholeCanvas`) behind everything.
- All text lives in real DOM sections above it — never inside WebGL.
  (Readable, anchor-linkable, screen-reader friendly.)
- Scroll progress (0 → 1 across the page) steers the camera along
  `WORMHOLE_JOURNEY` keyframes. Content sections are normal HTML with
  frosted-glass panels; the 3D dims behind text-heavy areas.
- Reduced motion → static starfield. Mobile → static gradient, no WebGL.

## Stations

| # | Station | Scroll ~ | 3D beat | DOM content |
|---|---------|----------|---------|-------------|
| 01 | Hero | 0.00–0.20 | Starfield drift, slow | Name, title, tagline, CTAs (RAG assistant, Am I a Fit?) |
| 02 | Projects | 0.30–0.55 | Wormhole forks — camera swings past 3 glowing branches | Category panels: **RAG / LLM**, **Full-Stack**, **Data / ML** — 2 projects each as glass cards |
| 03 | Skills | 0.60–0.80 | Constellation clusters drift by | **AI / Backend** (Python–FastAPI–LangChain–FAISS), **Frontend** (React–Next–TS–Tailwind), **Data / DevOps** (Docker–CI/CD–PostgreSQL) |
| 04 | Contact | 0.85–1.00 | Emerge — calm starfield, slow | Email, LinkedIn, GitHub, availability line |

## Figma mapping (for MCP codegen)

Design each station as a Figma frame; keep layers named and auto-layout on.
Variables for: `--space-bg`, `--accent-teal`, `--accent-violet`,
`--accent-amber`, `--glass` (frosted panel style). Copilot pulls these via
the Figma MCP server (`get_variable_defs`) so generated Tailwind matches.

## Copilot build prompts (per station)

- Hero: "Build the hero section from my current Figma selection. Full-viewport,
  headline + CTAs in a glass panel, canvas stays behind."
- Projects: "Build the projects section: three category columns, two glass
  project cards each, from the Figma selection. Keep cards readable over the
  dimmed canvas."
- Skills: "Build the skills section: three constellation-cluster groups with
  pill labels, from the Figma selection."
- Contact: "Build the contact section: calm, centered, email + socials."

## Fallbacks (must ship in v1)

- `prefers-reduced-motion`: render `<StaticStarfield/>` (CSS radial dots), no canvas.
- Mobile (`< 768px` or coarse pointer): static gradient + flat sections, no WebGL.
- WebGL context loss: catch and swap to the static fallback, never a blank page.

## Performance budget

- ≤ 1 draw-call-heavy object per station group; points/rings via buffer geometry.
- `dpr` capped at 1.75. No postprocessing in v1.
- Canvas `pointer-events: none`, `aria-hidden`.

## Phase plan

- **Phase 1 (this branch):** rig + canvas + stations framework + this spec + `/wormhole` preview route. No changes to live `main`.
- **Phase 2:** Figma station designs → Copilot builds real sections via Figma MCP.
- **Phase 3:** content fill (real projects, skills, copy), polish, perf pass.
- **Phase 4:** merge to `main` → Netlify deploys.
