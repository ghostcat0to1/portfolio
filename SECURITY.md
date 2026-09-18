# Security Policy

## Supported versions

Security fixes are applied on the default branch (`main`) of this public portfolio repository.

## Reporting a vulnerability

Please email **hqe.moreira@gmail.com**.

Do **not** open a public GitHub issue for security reports. Include:

- A short description of the issue and impact
- Steps to reproduce (or a proof-of-concept URL/path)
- Whether the issue is on henriquemoreira.eu, this repository, or both

You should receive an acknowledgement within a few business days.

## Scope

In scope:

- This repository and the deployed site at [henriquemoreira.eu](https://henriquemoreira.eu)
- Accidental exposure of secrets, credentials, or private keys in the tree or git history
- XSS, open redirects, or other client-side issues on the portfolio surface

Out of scope:

- Third-party linked prototypes on other hosts (report to those projects separately)
- Denial-of-service or volumetric traffic against Vercel hosting
- Issues that require physical access or compromised developer machines

## Secrets & configuration

- Never commit `.env`, API keys, or tokens. Use `.env.example` for placeholders only.
- Server secrets (if any) belong in the Vercel project environment — set via `vercel env add` or the Vercel dashboard, not in git.
- This site currently has **no live AI API route**; do not assume a `MISTRAL_API_KEY` is required to run the portfolio locally.

## Preferred disclosure

Coordinated disclosure is appreciated. Please allow reasonable time for a fix before public write-ups.
