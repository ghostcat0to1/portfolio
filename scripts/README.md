# Domain + email setup

## Architecture (harmonized, free-plan)

| Role | Where | Address pattern |
|---|---|---|
| **Outbound** (Resend) | one shared domain: `henriquemoreira.eu` | `velu@henriquemoreira.eu`, `grantemia@henriquemoreira.eu`, … |
| **Inbound** (Cloudflare) | each product domain | `hello@velu.fi`, `hello@grantemia.fi`, … → your personal inbox |

Resend free plan = **1 verified domain**. Do not add `velu.fi` / `grantemia.fi` there. Keep `henriquemoreira.eu`.

Config:
- `config/email.json` — shared sending domain
- `config/products.json` — per-product domain + `outboundFrom`

## Run (PowerShell)

Quotes required. Do **not** paste `>>`. No Resend key needed for this script.

```powershell
cd C:\GitHub\Projects\portfolio

$env:CLOUDFLARE_API_TOKEN = "..."
$env:CLOUDFLARE_ACCOUNT_ID = "..."
$env:FORWARD_TO = "hqe.moreira@gmail.com"

node scripts/setup-product-domain.cjs velu
```

Check status:

```powershell
$env:VERIFY_ONLY = "1"
node scripts/setup-product-domain.cjs velu
```
