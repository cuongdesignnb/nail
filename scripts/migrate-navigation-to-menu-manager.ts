import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const locations = [
  ["header-primary", "header_primary"],
  ["header-mobile", "header_mobile"],
  ["footer-company", "footer_company"],
  ["footer-services", "footer_services"],
  ["footer-explore", "footer_explore"],
  ["footer-legal", "footer_legal"],
  ["footer-social", "footer_social"],
] as const;

function countNested(items: any[]): number {
  return items.reduce((sum, item) => sum + (item.children?.length || 0) + countNested(item.children || []), 0);
}

async function main() {
  const report: any[] = [];
  for (const [key, location] of locations) {
    const menu = await prisma.navigationMenu.findUnique({ where: { key } });
    if (!menu) {
      report.push({ location, menuKey: key, importedItemCount: 0, nestedItemCount: 0, socialItemCount: 0, disabledInvalidLinks: 0, missingRouteWarnings: ["Menu missing before migration"], migrationSource: "default", publishedDataCreated: false, draftDataCreated: false });
      continue;
    }
    const draft = Array.isArray(menu.draftItems) ? menu.draftItems as any[] : [];
    const published = Array.isArray(menu.publishedItems) ? menu.publishedItems as any[] : [];
    report.push({
      location,
      menuKey: key,
      importedItemCount: draft.length,
      nestedItemCount: countNested(draft),
      socialItemCount: location === "footer_social" ? draft.length : 0,
      disabledInvalidLinks: draft.filter((item) => item.isEnabled === false).length,
      missingRouteWarnings: location === "footer_legal" ? draft.filter((item) => item.isEnabled === false).map((item) => `${item.label} is disabled until route exists`) : [],
      migrationSource: "default seed and existing menu manager data",
      publishedDataCreated: published.length > 0,
      draftDataCreated: draft.length > 0,
    });
  }

  await prisma.navigationMenuSetting.upsert({
    where: { key: "default" },
    update: {},
    create: {
      key: "default",
      headerMobileMode: "inherit_header_primary",
      headerMobileMenuKey: "header-mobile",
      footerLayout: "four_columns",
      footerShowSocial: true,
      footerShowLegal: true,
    },
  });

  const reportsDir = path.join(process.cwd(), "reports");
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(path.join(reportsDir, "navigation-menu-migration.json"), JSON.stringify(report, null, 2));
  fs.writeFileSync(
    path.join(reportsDir, "navigation-menu-migration.md"),
    [
      "# Navigation Menu Migration Report",
      "",
      "| Location | Menu Key | Imported Items | Nested Items | Social Items | Disabled Invalid Links | Published Data | Draft Data |",
      "|---|---|---:|---:|---:|---:|---|---|",
      ...report.map((row) => `| ${row.location} | ${row.menuKey} | ${row.importedItemCount} | ${row.nestedItemCount} | ${row.socialItemCount} | ${row.disabledInvalidLinks} | ${row.publishedDataCreated ? "Yes" : "No"} | ${row.draftDataCreated ? "Yes" : "No"} |`),
      "",
    ].join("\n")
  );

  console.log("Navigation menu migration report written.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
