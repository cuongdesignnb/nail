import fs from "node:fs";
import path from "node:path";
import { getSeoAuditRows } from "@/lib/seo/audit.service";
import { prisma } from "@/lib/db";

async function main() {
  const rows = await getSeoAuditRows();
  const reportsDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, "seo-audit.json"), JSON.stringify(rows, null, 2));
  fs.writeFileSync(
    path.join(reportsDir, "seo-audit.md"),
    `# SEO Audit\n\n${rows.map((row) => `- ${row.type} ${row.url}: title=${row.titleStatus}, description=${row.descriptionStatus}, canonical=${row.canonicalStatus}, og=${row.ogStatus}, schema=${row.schemaStatus}, sitemap=${row.sitemapStatus}`).join("\n")}\n`,
  );
  console.log(`SEO audit complete. ${rows.length} URL(s) inspected.`);
}

main().finally(() => prisma.$disconnect());

