# Portfolio — Codebook

> Personal portfolio — single-page with animated particle canvas, LYCAON live demo embed, and dark/light theme.
> Stack: Vite + React + React Router · Pure inline styles (no CSS files) · Canvas RAF animation · Vercel

---

## Stack decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Vite + React | Fast HMR, no build complexity |
| Routing | React Router v6 | Single route `/` — structure in place for future pages |
| Styling | Inline styles (no CSS files, no Tailwind) | Full control, no class naming friction, theme via prop drilling |
| Theme | `useState('dark')` in `App.jsx`, prop-drilled as `theme` | Simple — one boolean driving all color decisions inline |
| Canvas | RAF loop in `useParticles` hook | Same particle system as LYCAON/GRYPS — shared visual language |
| Demo embed | `LycaonDemo` component — iframe-like live embed | Showcases LYCAON's intelligence UI directly in the portfolio |
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
    </Routes>
  </BrowserRouter>
)
```

---

## Particle canvas (`useParticles` hook)

70 particles in 3 tiers (6 alpha / 18 beta / 46 omega). Amber/teal colour split (`i % 8 === 0 ? 'teal' : 'amber'`). Connection lines drawn between alpha↔alpha and alpha↔beta within distance thresholds.

```js
// Portfolio.jsx — useParticles(canvasRef, isLight)
const particles = Array.from({ length: 70 }, (_, i) => {
  const tier = i < 6 ? 'alpha' : i < 24 ? 'beta' : 'omega'
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: (Math.random() - 0.5) * (tier === 'alpha' ? 0.45 : 0.2),
    vy: (Math.random() - 0.5) * (tier === 'alpha' ? 0.35 : 0.15),
    size:    tier === 'alpha' ? Math.random() * 2 + 3.5
           : tier === 'beta'  ? Math.random() * 1.2 + 1.8
           :                    Math.random() * 0.7 + 0.6,
    opacity: tier === 'alpha' ? 0.85 : tier === 'beta' ? 0.55 : 0.22,
    pulse:   Math.random() * Math.PI * 2,
    tier,
    color: i % 8 === 0 ? 'teal' : 'amber',
  }
})
```

Connection line logic:
```js
// alpha↔alpha max 200px, alpha↔beta max 140px
const maxD = a.tier === 'alpha' && b.tier === 'alpha' ? 200 : 140
ctx.strokeStyle = `rgba(212,137,30,${(isLight ? 0.25 : 0.18) * (1 - dist / maxD)})`
ctx.lineWidth = a.tier === 'alpha' && b.tier === 'alpha' ? 0.8 : 0.4
```

Canvas is positioned `fixed` behind all content via `position: 'fixed', top: 0, left: 0, zIndex: 0`.

---

## Nav (`Nav.jsx`)

Fixed header with backdrop blur. HM symbol SVG logo on the left. Dark/light toggle button on the right.

```jsx
// Nav — frosted glass header
<nav style={{
  position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  padding: '14px 40px',
  background: isLight ? 'rgba(245,240,230,0.95)' : 'rgba(7,8,13,0.92)',
  backdropFilter: 'blur(12px)',
  borderBottom: `0.5px solid ${isLight ? 'rgba(212,137,30,0.2)' : 'rgba(212,137,30,0.08)'}`,
}}>
  <HMSymbol size={44} theme={...} />
  <button onClick={onToggleTheme}>◑ {isLight ? 'Dark' : 'Light'}</button>
</nav>
```

---

## HMSymbol (`HMSymbol.jsx`)

Animated SVG monogram — the HM brand mark. Uses canvas or SVG path animation. Same symbol used in Iraun.

---

## LycaonDemo (`LycaonDemo.jsx`)

Live embed of the LYCAON interface. Shows the intelligence platform running inside the portfolio page.

---

## Colour palette (amber + teal on deep navy)

```
Background dark:   #07080D   (deeper than LYCAON's #050D18)
Background light:  #F5F0E6   (warm off-white)
Accent amber:      rgba(212, 137, 30, ...)
Accent teal:       rgba(30, 200, 165, ...)
```

---

## File structure

```
portfolio/
├── index.html              # Vite entry point
├── src/
│   ├── App.jsx             # Root — theme state, BrowserRouter, single route
│   ├── pages/
│   │   └── Portfolio.jsx   # Main page — canvas, hero, product grid, LycaonDemo
│   └── components/
│       ├── Nav.jsx         # Fixed nav — HMSymbol + theme toggle
│       ├── HMSymbol.jsx    # Animated HM monogram SVG
│       └── LycaonDemo.jsx  # LYCAON live demo embed
├── public/
│   ├── favicon.svg
│   └── og-image.png
└── vite.config.js
```

---

## Environment variables

None — the portfolio is fully static. No API keys, no backend.

---

## Cookies & ePrivacy

**Banner required: No.** No first-party cookies or localStorage. Theme is in-memory only. Vercel Analytics is cookieless. No consent banner.

| Key | Type | Class |
|---|---|---|
| *(none)* | — | — |
| Vercel Analytics (`@vercel/analytics/react`) | — | Cookieless |

No advertising trackers. Google Fonts load from Google CDN (IP visible to Google) — disclose in a future privacy blurb; not a first-party cookie and no banner required for current storage. Optional privacy blurb may mention Vercel Analytics without requiring a cookie banner.