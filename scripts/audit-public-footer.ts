import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const findings: Array<{ file: string; issue: string }> = [];

function walk(dir: string): string[] {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(full, entry.name);
    if (entry.isDirectory()) return walk(path.relative(root, target));
    return /\.(tsx|ts|css)$/.test(entry.name) ? [path.relative(root, target).replace(/\\/g, "/")] : [];
  });
}

function read(file: string) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

for (const file of [...walk("app/(site)"), ...walk("components/public/shell")]) {
  const text = read(file);
  if (file.startsWith("app/(site)") && /<footer[\s>]/.test(text)) findings.push({ file, issue: "Inline footer in public route." });
  if (/components\/(layout|shared)\/.*Footer/.test(text)) findings.push({ file, issue: "Legacy Footer import remains." });
  if (/facebook\.com|instagram\.com|pinterest\.com|tiktok\.com/.test(text) && /Footer/.test(file)) findings.push({ file, issue: "Hardcoded social URL in Footer." });
  if (/alert\s*\(/.test(text) && /Footer/.test(file)) findings.push({ file, issue: "Browser alert in Footer." });
  if (/from ["']@\/lib\/data/.test(text) && /Footer/.test(file)) findings.push({ file, issue: "Footer imports lib/data.ts." });
  if (/fetchAboutPageContent/.test(text) && /Footer/.test(file)) findings.push({ file, issue: "Footer uses About content as global source." });
}

const globals = read("app/globals.css");
for (const pattern of [/^footer\s*\{/m, /^footer\s+a/m, /^footer\s+h3/m, /^footer\s+p/m, /^footer\[data-footer-layout/m]) {
  if (pattern.test(globals)) findings.push({ file: "app/globals.css", issue: `Generic global footer selector remains: ${pattern}` });
}

for (const legacy of ["components/shared/PublicFooter.tsx", "components/layout/Footer.tsx"]) {
  if (fs.existsSync(path.join(root, legacy))) findings.push({ file: legacy, issue: "Legacy duplicate Footer file exists." });
}

const report = { generatedAt: new Date().toISOString(), passed: findings.length === 0, findings };
fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/public-footer-audit.json"), `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(
  path.join(root, "reports/public-footer-audit.md"),
  findings.length ? [`# Public Footer Audit`, "", ...findings.map((item) => `- ${item.file}: ${item.issue}`), ""].join("\n") : "# Public Footer Audit\n\nPublic Footer audit passed.\n",
);

if (findings.length) {
  console.error("Public Footer audit failed.");
  for (const finding of findings) console.error(`- ${finding.file}: ${finding.issue}`);
  process.exit(1);
}

console.log("Public Footer audit passed.");
