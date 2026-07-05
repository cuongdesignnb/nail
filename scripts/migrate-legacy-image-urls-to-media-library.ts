import fs from "fs";
import path from "path";

const reportDir = path.join(process.cwd(), "reports");
const jsonPath = path.join(reportDir, "media-migration-report.json");
const mdPath = path.join(reportDir, "media-migration-report.md");

const report = {
  generatedAt: new Date().toISOString(),
  summary: "Legacy image migration scaffold created. No records were modified in this run.",
  items: [] as Array<Record<string, unknown>>,
};

fs.mkdirSync(reportDir, { recursive: true });
fs.writeFileSync(jsonPath, JSON.stringify(report, null, 2));
fs.writeFileSync(
  mdPath,
  [
    "# Media Migration Report",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    report.summary,
    "",
  ].join("\n")
);

console.log("Media migration report generated. No records modified.");
