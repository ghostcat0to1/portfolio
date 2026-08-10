#!/usr/bin/env node
/**
 * Harmonized, per-product domain + inbound email setup.
 *
 * Architecture (free-plan compatible):
 *   OUTBOUND (Resend): one shared verified domain for every product —
 *     henriquemoreira.eu  →  send as  <product>@henriquemoreira.eu
 *     (Resend free plan = 1 domain; do not add product domains there)
 *   INBOUND (Cloudflare): each product keeps hello@<product-domain>
 *     forwarded to one personal inbox via Email Routing
 *
 * This script only sets up Cloudflare (zone + hosting DNS + inbound
 * forwarding). It does NOT touch Resend domains.
 *
 * Usage (PowerShell — quote every value, no >> prefixes):
 *   $env:CLOUDFLARE_API_TOKEN = "..."
 *   $env:CLOUDFLARE_ACCOUNT_ID = "..."
 *   $env:FORWARD_TO = "you@personal.com"
 *   node scripts/setup-product-domain.cjs <product>
 *
 * Product list: config/products.json
 * Shared sending domain: config/email.json
 */

const fs = require("fs");
const path = require("path");

const CF_TOKEN = process.env.CLOUDFLARE_API_TOKEN;
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const FORWARD_TO = process.env.FORWARD_TO;
const VERIFY_ONLY = process.env.VERIFY_ONLY === "1";

const CF_BASE = "https://api.cloudflare.com/client/v4";

const productName = process.argv[2];
if (!productName) {
  console.error("Usage: node scripts/setup-product-domain.cjs <product>");
  console.error("See config/products.json for valid product names.");
  process.exit(1);
}

const root = path.join(__dirname, "..");
const products = JSON.parse(fs.readFileSync(path.join(root, "config", "products.json"), "utf8"));
const emailConfig = JSON.parse(fs.readFileSync(path.join(root, "config", "email.json"), "utf8"));
const product = products.find((p) => p.product === productName);
if (!product) {
  console.error(`Unknown product "${productName}". Valid: ${products.map((p) => p.product).join(", ")}`);
  process.exit(1);
}

if (product.status === "not_registered") {
  console.error(
    `${product.domain} is not registered yet. Register the domain first, then set status to "registered" in config/products.json and re-run.`
  );
  process.exit(1);
}

const DOMAIN = product.domain;
const OUTBOUND_FROM = product.outboundFrom || `${product.product}@${emailConfig.sendingDomain}`;

function requireEnv() {
  const missing = [];
  if (!CF_TOKEN) missing.push("CLOUDFLARE_API_TOKEN");
  if (!CF_ACCOUNT_ID) missing.push("CLOUDFLARE_ACCOUNT_ID");
  if (!FORWARD_TO) missing.push("FORWARD_TO");
  if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

async function cfFetch(pathname, opts = {}) {
  const res = await fetch(`${CF_BASE}${pathname}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${CF_TOKEN}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok || body.success === false) {
    throw new Error(`Cloudflare ${opts.method || "GET"} ${pathname} failed: ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

async function ensureZone() {
  const list = await cfFetch(`/zones?name=${encodeURIComponent(DOMAIN)}`);
  if (list.result && list.result.length) {
    const zone = list.result[0];
    console.log(`[Cloudflare] Zone for ${DOMAIN} exists (id: ${zone.id}, status: ${zone.status})`);
    if (zone.status !== "active") {
      console.log(
        `[Cloudflare] ACTION NEEDED: point ${DOMAIN}'s nameservers at your registrar to: ${zone.name_servers?.join(", ")}`
      );
    }
    return zone;
  }
  console.log(`[Cloudflare] Creating zone for ${DOMAIN}...`);
  const created = await cfFetch("/zones", {
    method: "POST",
    body: JSON.stringify({ name: DOMAIN, account: { id: CF_ACCOUNT_ID } }),
  });
  const zone = created.result;
  console.log(`[Cloudflare] Zone created (id: ${zone.id}).`);
  console.log(
    `[Cloudflare] ACTION NEEDED: at ${DOMAIN}'s registrar, set nameservers to:\n  ${zone.name_servers?.join("\n  ")}`
  );
  console.log("[Cloudflare] Re-run this script (or VERIFY_ONLY=1) once the zone shows status: active.");
  return zone;
}

async function listDnsByName(zoneId, recordName) {
  const list = await cfFetch(`/zones/${zoneId}/dns_records?name=${encodeURIComponent(recordName)}`);
  return list.result || [];
}

async function upsertDnsRecord(zoneId, { type, name, content, priority, proxied = false }) {
  const recordName = !name || name === "@" ? DOMAIN : name.endsWith(DOMAIN) ? name : `${name}.${DOMAIN}`;
  const sameType = (await listDnsByName(zoneId, recordName)).filter((r) => r.type === type);
  const existing = sameType.find((r) => r.content === content);
  if (existing) {
    console.log(`[Cloudflare] DNS record already present: ${type} ${recordName} -> ${content}`);
    return;
  }
  console.log(`[Cloudflare] Creating DNS record: ${type} ${recordName} -> ${content}`);
  await cfFetch(`/zones/${zoneId}/dns_records`, {
    method: "POST",
    body: JSON.stringify({ type, name: recordName, content, ttl: 3600, proxied, ...(priority ? { priority } : {}) }),
  });
}

async function ensureVercelRecords(zoneId) {
  if (!product.vercelHosted) return;
  console.log("[Cloudflare] Ensuring Vercel hosting records...");

  const apex = await listDnsByName(zoneId, DOMAIN);
  const apexHost = apex.find((r) => r.type === "A" || r.type === "AAAA" || r.type === "CNAME");
  if (apexHost) {
    console.log(
      `[Cloudflare] Apex already has ${apexHost.type} -> ${apexHost.content}; leaving hosting DNS alone.`
    );
  } else {
    await upsertDnsRecord(zoneId, { type: "A", name: "@", content: "76.76.21.21", proxied: false });
  }

  const wwwName = `www.${DOMAIN}`;
  const www = await listDnsByName(zoneId, wwwName);
  const wwwHost = www.find((r) => r.type === "A" || r.type === "AAAA" || r.type === "CNAME");
  if (wwwHost) {
    console.log(
      `[Cloudflare] www already has ${wwwHost.type} -> ${wwwHost.content}; leaving it alone.`
    );
  } else {
    await upsertDnsRecord(zoneId, { type: "CNAME", name: "www", content: "cname.vercel-dns.com", proxied: false });
  }
}

async function getEmailRouting(zoneId) {
  try {
    const body = await cfFetch(`/zones/${zoneId}/email/routing`);
    return body.result;
  } catch (err) {
    if (/Authentication error|10000|403/.test(String(err.message))) {
      return null; // token may lack Email Routing Settings:Read
    }
    throw err;
  }
}

async function enableEmailRouting(zoneId) {
  const current = await getEmailRouting(zoneId);
  if (current?.enabled) {
    console.log("[Cloudflare] Email Routing already enabled.");
    return;
  }

  // MX already on Cloudflare is a strong signal routing was enabled in the dashboard.
  const mx = await listDnsByName(zoneId, DOMAIN);
  const hasCfMx = mx.some((r) => r.type === "MX" && String(r.content).includes("mx.cloudflare.net"));
  if (hasCfMx) {
    console.log(
      "[Cloudflare] Cloudflare MX already present — treating Email Routing as enabled (skipping /enable)."
    );
    return;
  }

  console.log("[Cloudflare] Ensuring Email Routing is enabled...");
  try {
    await cfFetch(`/zones/${zoneId}/email/routing/enable`, { method: "POST" });
    console.log("[Cloudflare] Email Routing enabled.");
  } catch (err) {
    if (/already enabled|1004/.test(String(err.message))) {
      console.log("[Cloudflare] Email Routing already enabled.");
      return;
    }
    if (/Authentication error|10000|403/.test(String(err.message))) {
      console.error(
        "[Cloudflare] Token lacks Email Routing permission.\n" +
          "  Edit your Cloudflare API token and add:\n" +
          "    Zone → Email Routing Settings → Edit\n" +
          "    Zone → Email Routing Rules → Edit\n" +
          "    Account → Email Routing Addresses → Edit\n" +
          "  Then re-run. (Or enable Email Routing once in the Cloudflare dashboard for this zone.)"
      );
      throw err;
    }
    throw err;
  }
}

async function ensureDestinationAddress() {
  const list = await cfFetch(`/accounts/${CF_ACCOUNT_ID}/email/routing/addresses`);
  const existing = (list.result || []).find((a) => a.email === FORWARD_TO);
  if (existing) {
    console.log(`[Cloudflare] Destination ${FORWARD_TO} registered (verified: ${existing.verified ? "yes" : "no"})`);
    if (!existing.verified) {
      console.log(`[Cloudflare] ACTION NEEDED: click the verification link Cloudflare sent to ${FORWARD_TO}.`);
    }
    return existing;
  }
  console.log(`[Cloudflare] Registering destination address ${FORWARD_TO}...`);
  await cfFetch(`/accounts/${CF_ACCOUNT_ID}/email/routing/addresses`, {
    method: "POST",
    body: JSON.stringify({ email: FORWARD_TO }),
  });
  console.log(`[Cloudflare] ACTION NEEDED: click the verification link Cloudflare just emailed to ${FORWARD_TO}.`);
}

async function ensureForwardingRule(zoneId) {
  const helloAddress = `hello@${DOMAIN}`;
  const rules = await cfFetch(`/zones/${zoneId}/email/routing/rules`);
  const existing = (rules.result || []).find((r) =>
    (r.matchers || []).some((m) => m.type === "literal" && m.field === "to" && m.value === helloAddress)
  );
  if (existing) {
    console.log(`[Cloudflare] Forwarding rule for ${helloAddress} already exists.`);
    return;
  }
  console.log(`[Cloudflare] Creating forwarding rule: ${helloAddress} -> ${FORWARD_TO}`);
  await cfFetch(`/zones/${zoneId}/email/routing/rules`, {
    method: "POST",
    body: JSON.stringify({
      matchers: [{ type: "literal", field: "to", value: helloAddress }],
      actions: [{ type: "forward", value: [FORWARD_TO] }],
      enabled: true,
      name: `Forward ${helloAddress} to personal inbox`,
    }),
  });
}

async function reportInboundStatus(zoneId) {
  const rules = await cfFetch(`/zones/${zoneId}/email/routing/rules`);
  const helloAddress = `hello@${DOMAIN}`;
  const rule = (rules.result || []).find((r) =>
    (r.matchers || []).some((m) => m.type === "literal" && m.field === "to" && m.value === helloAddress)
  );
  console.log(`[Inbound] hello@${DOMAIN} rule: ${rule ? "present" : "missing"}`);
  console.log(`[Outbound] send as: ${OUTBOUND_FROM} (shared Resend domain ${emailConfig.sendingDomain})`);
}

async function main() {
  requireEnv();
  console.log(`\n=== ${productName} (${DOMAIN}) ===`);
  console.log(`Outbound From (Resend): ${OUTBOUND_FROM}`);
  console.log(`Inbound To (Cloudflare): hello@${DOMAIN} -> ${FORWARD_TO}\n`);

  const zone = await ensureZone();

  if (VERIFY_ONLY) {
    if (zone.status === "active") await reportInboundStatus(zone.id);
    return;
  }

  if (zone.status !== "active") {
    console.log("[Cloudflare] Zone not active yet — skipping DNS/routing until nameservers propagate.");
    console.log("Re-run this script once the zone is active.");
    return;
  }

  await ensureVercelRecords(zone.id);
  await enableEmailRouting(zone.id);
  await ensureDestinationAddress();
  await ensureForwardingRule(zone.id);
  await reportInboundStatus(zone.id);

  console.log(`\nDone for ${productName}.`);
  console.log(`  1. If prompted, click the Cloudflare verification link sent to ${FORWARD_TO}.`);
  console.log(`  2. Inbound: hello@${DOMAIN} forwards to ${FORWARD_TO}.`);
  console.log(`  3. Outbound: product code must send From "${OUTBOUND_FROM}" (not hello@${DOMAIN}) until Resend is upgraded.`);
}

main().catch((err) => {
  console.error(`\nFailed for ${productName}:`, err.message);
  process.exit(1);
});
