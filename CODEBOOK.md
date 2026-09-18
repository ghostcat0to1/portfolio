# Portfolio — Codebook

> Personal portfolio — animated particle canvas, GRYPS live featured project (skill demo), earlier prototypes, Privacy/Terms, dark/light theme.
> Stack: Vite + React + React Router · Pure inline styles (no CSS files) · Canvas RAF animation · Vercel Analytics · Vercel

---

## Public posture

- **Indexed:** this site + GRYPS only. Earlier prototypes are linked with `rel="nofollow noreferrer"` and stay noindex on their own hosts. FORGE is private ops (noindex) — listed without a public login link.
- **Hierarchy:** GRYPS Live card first; Earlier prototypes grid (LitrixEU, Grantemia, Velu, Lycaon, DisclAI, Iraun). No Grantemia PT.
- **CTAs:** prototype cards use **Open prototype** — not Try/Buy/Visit. Job-seeking commercial-role copy may exist elsewhere; prototypes are not a storefront.
- **GrypsDemo:** Path A whitelist loop only (`src/components/GrypsDemo.jsx`) — Score 47 · Grade D golden Advisor run; no invented RF/countdown metrics; GOLDEN strings stay frozen. Lazy-loaded via `React.lazy` + `Suspense`.
- **Audience for GRYPS:** OT security / compliance skill demonstration, not a SaaS pitch deck.
- **GitHub front door:** public `README.md` (posture + stack + how to run); architecture stays in this codebook. Proprietary `LICENSE` harmonized with sibling portfolio repos.
- **Stack honesty:** footer and README claim only technologies this repo uses (Vite · React · React Router · Vercel). Do not list Next.js / Neon / Resend / Cloudflare / Mistral unless they land in this tree.

### Changelog — 2026-09

- **2026-09-18 (professional cleanup):** Removed Vite scaffold assets, unused Gryps video/PNG, unused `icons.svg`, unmounted `LycaonDemo`, and unused `api/gemini.js`. CTAs → Open prototype. GrypsDemo Score 47 · Grade D synced. Photo compressed (WebP/JPEG + lazy). Dependabot commit prefix fixed (`chore` + scope → `chore(deps):`). Privacy/Terms: no live AI API on this deployment; GrypsDemo disclosed as illustrative motion.
- **2026-09-18 (Forge s21):** GitHub owner URLs → `hqemoreira`. Hub remains under Forge `seo-geo-digest`; clicks ≠ visitors posture unchanged.
- **2026-09-18 (Forge s20):** CODEBOOK synced with Forge journals. Hub copy aligned to AI product / systems roles; GRYPS Live + Open prototype framing; Forge `seo-geo-digest` + clicks≠visitors clarity.
- Public README shipped as GitHub front door (posture + stack + how to run); architecture stays in this codebook.
- Proprietary LICENSE harmonized across the portfolio (same wording family as sibling repos).
- Active/indexed: Portfolio + GRYPS only. FORGE is private ops (noindex).
- Skill-demo framing; GrypsDemo Path A; Grantemia PT retired from public hierarchy.

---

## Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Vite + React | Fast HMR, no build complexity |
| Routing | React Router | `/`, `/privacy`, `/terms`, catch-all 404 |
| Styling | Inline styles (no CSS files, no Tailwind) | Full control, no class naming friction, theme via prop drilling |
| Theme | `useState('dark')` in `App.jsx`, prop-drilled as `theme` | Simple — one boolean driving all color decisions inline |
| Canvas | RAF loop `useParticles` inside `Portfolio.jsx` | Shared visual language with LYCAON/GRYPS |
| Projects | GRYPS featured Live card; earlier prototypes in grid | Gryps owns Live; others are context |
| Legal | `/privacy` + `/terms` (EN) | EU AI Act + GDPR disclosures; footer-linked |
| Deployment | Vercel — `henriquemoreira.eu` | Auto-deploy from GitHub push |
| Analytics | `@vercel/analytics` | Cookieless |

---

## Theme system

No CSS variables. Theme state lives in `App.jsx` as `useState('dark')`. Every component receives `theme` as a prop. Colors are computed inline.

```jsx
// App.jsx
const [theme, setTheme] = useState('dark')
const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark')

return (
  <BrowserRouter>
    <Nav theme={theme} onToggleTheme={toggleTheme} />
    <Routes>
      <Route path="/" element={<Portfolio theme={theme} />} />
      <Route path="/privacy" element={<Privacy theme={theme} />} />
      <Route path="/terms" element={<Terms theme={theme} />} />
      <Route path="*" element={<NotFound theme={theme} />} />
    </Routes>
  </BrowserRouter>
)
```

---

## Copy house rules

- **UI language:** English only (spoken-languages section is biography, not UI locale).
- **Dashes:** em dash (—) for sentence breaks; middle dot (·) for coords/meta lists; hyphen for compounds.
- **Product names:** GRYPS (live) · LitrixEU · Grantemia · Velu · Lycaon · DisclAI · Iraun · FORGE.
- **FORGE:** personal/internal projects dashboard only — not a public product. Show `forge.henriquemoreira.eu (private — no public access)`; do not deep-link visitors to login.
- **Unmounted demos:** do not keep dead demo components in-tree; remove rather than leave for “maybe later.”

---

## Legal (Privacy + Terms)

Required public pages: **Privacy** and **Terms**, linked from the footer.

Must stay accurate (not legal advice):

- Maintainer framing: private individual / maintained by Henrique Moreira · Espoo, Finland · contact `hqe.moreira@gmail.com` (avoid “sole operator”)
- This deployment: **no live AI API route**. GrypsDemo is illustrative Path A motion (Score 47 · Grade D), not a live API call
- Classification: **limited-risk** under Regulation (EU) 2024/1689 — **not** minimal-risk
- Article 50: AI disclosed at the point of exposure; human oversight; no prohibited/high-risk claims; no automated decisions with legal or similarly significant effects
- Do **not** use a living “Last updated: …” date in legal chrome
- GDPR: categories, processors (Vercel, Analytics, Google Fonts), retention, rights
- Copyright footer: `© {year} Henrique Moreira · All rights reserved`

**When adding or changing AI surfaces (demos, API routes, labels), keep Privacy + Terms processor claims accurate in the same PR.**

Shared layout: `src/components/LegalShell.jsx`. Pages: `src/pages/Privacy.jsx`, `src/pages/Terms.jsx`.

---

## Particle canvas (`useParticles` in `Portfolio.jsx`)

70 particles in 3 tiers (6 alpha / 18 beta / 46 omega). Amber/teal colour split (`i % 8 === 0 ? 'teal' : 'amber'`). Connection lines drawn between alpha↔alpha and alpha↔beta within distance thresholds. Respects `prefers-reduced-motion` (static frame when reduced).

---

## Nav (`Nav.jsx`)

Fixed header with backdrop blur. HM symbol SVG logo on the left. Dark/light toggle button on the right (`aria-label` for theme).

---

## HMSymbol (`HMSymbol.jsx`)

SVG monogram — keep path data and brand colours unchanged unless explicitly redesigning the mark.

---

## Environment variables

| Variable | Where | Notes |
|---|---|---|
| *(none required)* | — | Local `npm run dev` needs no secrets. |
| `MISTRAL_API_KEY` | — | **Not used** by this repo after removal of `api/gemini.js`. Re-document here if a server AI route returns. |

Theme and portfolio page itself need no client env vars.

---

## Ops scripts (optional)

`scripts/setup-product-domain.cjs` + `config/email.json` / `config/products.json` are Cloudflare Email Routing helpers for product domains. They read `CLOUDFLARE_API_TOKEN` from the environment only — never commit tokens. Not required to run the portfolio site.

---

## Cookies & ePrivacy

**Banner required: No.** No first-party cookies or localStorage. Theme is in-memory only. Vercel Analytics is cookieless. No consent banner.

| Key | Type | Class |
|---|---|---|
| *(none)* | — | — |
| Vercel Analytics (`@vercel/analytics/react`) | — | Cookieless |

No advertising trackers. Google Fonts load from Google CDN (IP visible to Google) — disclosed on `/privacy`. Vercel Analytics disclosed there as well.
