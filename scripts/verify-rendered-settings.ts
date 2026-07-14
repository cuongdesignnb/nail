import { getPublicSiteSettings } from "../lib/settings/public-settings.service";
import { getSeoSiteSettings } from "../lib/seo/seo.service";
import { prisma } from "../lib/db";

const baseUrl = (process.env.SETTINGS_VERIFY_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
let failed = false;
function check(value: boolean, label: string) { console.log(`${value ? "PASS" : "FAIL"} ${label}`); if (!value) failed = true; }
async function text(path: string) { const response = await fetch(`${baseUrl}${path}`); if (!response.ok) throw new Error(`${path} returned ${response.status}`); return response.text(); }

async function main() {
  const [settings, seo, home, contact, bookingPage, giftCards, catalogResponse, paypalResponse] = await Promise.all([
    getPublicSiteSettings({ uncached: true }), getSeoSiteSettings(), text("/"), text("/contact"), text("/booking"), text("/gift-cards"),
    fetch(`${baseUrl}/api/public/booking/catalog`, { cache: "no-store" }), fetch(`${baseUrl}/api/public/paypal/config`, { cache: "no-store" }),
  ]);
  const catalog = await catalogResponse.json();
  const paypalText = await paypalResponse.text();
  check(home.includes(settings.brand.name) && home.includes(settings.contact.phone), "Salon Info → rendered Homepage");
  check(contact.includes(settings.contact.email) && contact.includes(settings.contact.address), "Salon Info → rendered Contact page");
  check(home.includes(settings.businessHoursSummary) && contact.includes(settings.businessHoursSummary), "Business Hours → rendered Home/Contact");
  check(catalog.success && JSON.stringify(catalog.data.business.bookingPolicies) === JSON.stringify(settings.bookingPolicies), "Booking Policies → public booking catalog");
  check(!("payment" in (catalog.data || {})) && bookingPage.includes("Payment is collected at the salon"), "Payments → normal Booking has no PayPal/deposit coupling");
  check(paypalResponse.ok && !/secret|encryptedClientSecret/i.test(paypalText) && giftCards.length > 0, "PayPal → Gift Card public boundary is safe");
  check(!/encryptedPassword|SMTP_PASSWORD|APP_SECRETS_ENCRYPTION_KEY/.test(home + contact + giftCards), "Email & SMTP → no credential appears in rendered public HTML");
  check(!/encryptedApiKey|apiKeyLastFour|OPENAI_API_KEY/.test(home + contact + giftCards), "AI Content → no provider credential appears in rendered public HTML");
  check(!settings.brand.logo?.src || home.includes(settings.brand.logo.src), "Branding logo → rendered shared shell");
  check(!settings.brand.favicon?.src || home.includes(settings.brand.favicon.src), "Branding favicon → rendered metadata");
  check(home.includes("<title") && home.includes(settings.brand.name), "SEO → rendered title metadata");
  check(!seo.enableWebSiteSchema || home.includes('"@type":"WebSite"') || home.includes('&quot;@type&quot;:&quot;WebSite&quot;'), "SEO WebSite schema toggle → rendered JSON-LD");
  check(catalog.data.business.timezone === settings.timezone && catalog.data.business.currency === settings.currency, "General timezone/currency → booking public catalog");

  const [smtp, ai] = await Promise.all([
    prisma.emailSmtpSetting.findUnique({ where: { key: "default" } }),
    prisma.aiProviderSetting.findUnique({ where: { provider: "openai" } }),
  ]);
  if (smtp?.encryptedPassword) check(!home.includes(smtp.encryptedPassword), "SMTP encrypted password absent from HTML");
  if (ai?.encryptedApiKey) check(!home.includes(ai.encryptedApiKey), "AI encrypted key absent from HTML");
}

main().catch((error) => { failed = true; console.error("FAIL rendered settings verification", error); }).finally(async () => { await prisma.$disconnect(); if (failed) process.exitCode = 1; });
