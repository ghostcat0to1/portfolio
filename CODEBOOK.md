# Portfolio — Codebook

> Personal portfolio — animated particle canvas, scripted LYCAON illustrative demo, Privacy/Terms, dark/light theme.
> Stack: Vite + React + React Router · Pure inline styles (no CSS files) · Canvas RAF animation · Vercel

---

## Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Vite + React | Fast HMR, no build complexity |
| Routing | React Router | `/`, `/privacy`, `/terms`, catch-all 404 |
| Styling | Inline styles (no CSS files, no Tailwind) | Full control, no class naming friction, theme via prop drilling |
| Theme | `useState('dark')` in `App.jsx`, prop-drilled as `theme` | Simple — one boolean driving all color decisions inline |
| Canvas | RAF loop in `useParticles` hook | Same particle system as LYCAON/GRYPS — shared visual language |
| Demo embed | `LycaonDemo` — scripted illustrative preview (not live AI) | Shows LYCAON's six-dimension UI without a live model call |
| Legal | `/privacy` + `/terms` (EN) | EU AI Act + GDPR disclosures; footer-linked |
| Deployment | Vercel — `henriquemoreira.eu` | Auto-deploy from GitHub push |

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
- **Product names:** LYCAON · GRYPS · Velu · Grantemia FI / removed · FORGE (card marks may be uppercase).
- **FORGE:** personal/internal projects dashboard only — not a public product. Show `forge.henriquemoreira.eu (private — no public access)`; do not deep-link visitors to login.

---

## Legal (Privacy + Terms)

Required public pages: **Privacy** and **Terms**, linked from the footer.

Must stay accurate (not legal advice):

- Operator: Henrique Moreira · Espoo, Finland · contact `hqe.moreira@gmail.com`
- AI provider for live model calls: **Mistral only** (no Gemini/OpenAI unless that becomes true)
- Classification: **limited-risk** under Regulation (EU) 2024/1689 — **not** minimal-risk
- Article 50: AI disclosed at the point of exposure; human oversight; no prohibited/high-risk claims; no automated decisions with legal or similarly significant effects
- What is / isn’t AI-generated (portal chrome vs AI); LycaonDemo is **scripted**, not live AI
- “Last updated: …” bumped whenever AI features or processors change
- GDPR: categories, processors (Vercel, Analytics, Google Fonts, Mistral when used), retention, rights
- Copyright footer: `© {year} Henrique Moreira · All rights reserved`

**When adding or changing AI surfaces (demos, API routes, labels), update Privacy + Terms Last updated in the same PR.**

Shared layout: `src/components/LegalShell.jsx`. Pages: `src/pages/Privacy.jsx`, `src/pages/Terms.jsx`.

---

## Particle canvas (`useParticles` hook)

70 particles in 3 tiers (6 alpha / 18 beta / 46 omega). Amber/teal colour split (`i % 8 === 0 ? 'teal' : 'amber'`). Connection lines drawn between alpha↔alpha and alpha↔beta within distance thresholds. Respects `prefers-reduced-motion` (static frame when reduced).

---

## Nav (`Nav.jsx`)

Fixed header with backdrop blur. HM symbol SVG logo on the left. Dark/light toggle button on the right.

---

## HMSymbol (`HMSymbol.jsx`)

SVG monogram — keep path data and brand colours unchanged unless explicitly redesigning the mark.

---

## Environment variables

| Variable | Where | Notes |
|---|---|---|
| `MISTRAL_API_KEY` | Vercel (server) | Used by `api/gemini.js` — Mistral-backed; Gemini-shaped request/response for frontend compat. Filename is historical. |

Theme and portfolio page itself need no client env vars.

---

## Cookies & ePrivacy

**Banner required: No.** No first-party cookies or localStorage. Theme is in-memory only. Vercel Analytics is cookieless. No consent banner.

| Key | Type | Class |
|---|---|---|
| *(none)* | — | — |
| Vercel Analytics (`@vercel/analytics/react`) | — | Cookieless |

No advertising trackers. Google Fonts load from Google CDN (IP visible to Google) — disclosed on `/privacy`. Vercel Analytics disclosed there as well.
