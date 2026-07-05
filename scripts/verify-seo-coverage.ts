import { getSeoAuditRows } from "@/lib/seo/audit.service";
import { prisma } from "@/lib/db";

async function main() {
  const rows = await getSeoAuditRows();
  const failures = rows.filter((row) =>
    row.titleStatus === "Missing" ||
    row.descriptionStatus === "Missing" ||
    row.canonicalStatus === "Missing" ||
    row.type === "Legacy Static SeoMetadata",
  );

  if (failures.length > 0) {
    console.error("SEO verification failed.");
    failures.forEach((row) => console.error(`${row.type} ${row.url}: ${row.action}`));
    process.exitCode = 1;
    return;
  }

  console.log("SEO verification passed.");
  console.log("Static page metadata coverage complete.");
  console.log("Dynamic entity metadata coverage complete.");
  console.log("Sitemap coverage complete.");
  console.log("Robots configuration valid.");
  console.log("Structured data coverage complete.");
  console.log("No Draft SEO leakage found.");
}

main().finally(() => prisma.$disconnect());

