import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const appDir = path.join(root, "app");
const componentsDir = path.join(root, "components");

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return /\.(tsx|ts)$/.test(entry.name) ? [full] : [];
  });
}

const files = [...walk(appDir), ...walk(componentsDir)];
const findings: Array<{ file: string; issue: string }> = [];

function rel(file: string) {
  return path.relative(root, file).replace(/\\/g, "/");
}

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const relative = rel(file);
  if (/components\/layout\/(Header|Footer)/.test(text)) findings.push({ file: relative, issue: "Imports legacy layout Header/Footer." });
  if (/components\/shared\/Public(Header|Footer)/.test(text)) findings.push({ file: relative, issue: "Imports legacy shared PublicHeader/PublicFooter." });
  if (/const\s+navItems\s*=/.test(text)) findings.push({ file: relative, issue: "Contains static navItems array." });
  if (/alert\s*\(/.test(text) && !relative.startsWith("app/admin") && !relative.startsWith("components/admin")) findings.push({ file: relative, issue: "Contains browser alert in public code." });
  if (/facebook\.com|instagram\.com|pinterest\.com|tiktok\.com/.test(text) && /Footer/.test(relative)) findings.push({ file: relative, issue: "Footer contains hardcoded social URL." });
  if (/\/aera-mark\.svg|\/images\/logo-aera\.png/.test(text) && /(Header|Footer|shell)/i.test(relative)) findings.push({ file: relative, issue: "Header/Footer shell contains hardcoded logo URL." });
}

for (const duplicate of [
  "components/shared/PublicHeader.tsx",
  "components/shared/PublicFooter.tsx",
  "components/layout/Header.tsx",
  "components/layout/Footer.tsx",
]) {
  if (fs.existsSync(path.join(root, duplicate))) findings.push({ file: duplicate, issue: "Legacy duplicate component still exists." });
}

const report = {
  generatedAt: new Date().toISOString(),
  passed: findings.length === 0,
  findings,
};

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/public-shell-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(
  path.join(root, "reports/public-shell-audit.md"),
  findings.length
    ? [`# Public Shell Audit`, "", ...findings.map((finding) => `- ${finding.file}: ${finding.issue}`), ""].join("\n")
    : "# Public Shell Audit\n\nPublic shell audit passed.\n",
);

if (findings.length) {
  console.error("Public shell audit failed.");
  for (const finding of findings) console.error(`- ${finding.file}: ${finding.issue}`);
  process.exit(1);
}

console.log("Public shell audit passed.");
