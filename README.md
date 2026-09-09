# Portfolio

Personal site hub for Henrique Moreira (Espoo, Finland). Indexed public surface featuring **GRYPS** as the live skill demo, with earlier prototypes linked for context — not a SaaS storefront.

**Live:** [henriquemoreira.eu](https://henriquemoreira.eu)

## What’s on the site

- Animated particle canvas + dark/light theme
- GRYPS Live card (OT security / compliance skill demonstration)
- Earlier prototypes grid (Litrix, Grantemia, Velu, Lycaon, DisclAI, Iraun) — `rel="nofollow"`
- Privacy / Terms

## Stack

- Vite + React + React Router
- Pure inline styles (no CSS files / Tailwind)
- Canvas RAF particle system
- Vercel

## Local development

```bash
npm install
npm run dev
```

Optional server AI proxy uses `MISTRAL_API_KEY` on Vercel (`api/gemini.js` is Mistral-backed; filename is historical). Never commit secrets.

## Docs

Maintainer notes live in [`CODEBOOK.md`](./CODEBOOK.md).

## License

Proprietary — see [`LICENSE`](./LICENSE). All rights reserved.
