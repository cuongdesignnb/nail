const routes = ["/", "/about", "/services", "/gallery", "/packages", "/promotions", "/contact", "/blog", "/booking"];

async function main() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const failures: string[] = [];
  for (const route of routes) {
    const res = await fetch(`${base}${route}`);
    const html = await res.text();
    if (!/<title>[^<]+<\/title>/i.test(html)) failures.push(`${route}: missing <title>`);
    if (!/name="description"/i.test(html)) failures.push(`${route}: missing meta description`);
    if (!/rel="canonical"/i.test(html)) failures.push(`${route}: missing canonical`);
    if (!/property="og:title"/i.test(html)) failures.push(`${route}: missing og:title`);
    if (!/name="twitter:card"/i.test(html)) failures.push(`${route}: missing twitter card`);
    if (!/application\/ld\+json/i.test(html)) failures.push(`${route}: missing JSON-LD`);
  }
  if (failures.length) {
    console.error("Rendered SEO verification failed.");
    failures.forEach((failure) => console.error(failure));
    process.exit(1);
  }
  console.log("Rendered SEO verification passed.");
}

main();

