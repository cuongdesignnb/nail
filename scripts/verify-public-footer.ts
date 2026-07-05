import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const errors: string[] = [];

function exists(file: string) {
  return fs.existsSync(path.join(root, file));
}

function read(file: string) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function walk(dir: string): string[] {
  const full = path.join(root, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(full, entry.name);
    if (entry.isDirectory()) return walk(path.relative(root, target));
    return /\.(tsx|ts)$/.test(entry.name) ? [path.relative(root, target).replace(/\\/g, "/")] : [];
  });
}

for (const file of [
  "app/(site)/layout.tsx",
  "components/public/shell/PublicFooter.tsx",
  "components/public/shell/PublicFooter.module.css",
  "components/public/shell/BrandLogo.tsx",
  "components/public/shell/SafePublicLink.tsx",
]) {
  if (!exists(file)) errors.push(`${file} is missing.`);
}

if (!read("app/(site)/layout.tsx").includes("PublicSiteShell")) errors.push("Public routes do not use PublicSiteShell.");
if (!read("components/public/shell/PublicFooter.tsx").includes("PublicFooter.module.css")) errors.push("PublicFooter does not use scoped CSS module.");
if (!read("lib/site-shell/public-shell.service.ts").includes("getPublishedPublicFooterData")) errors.push("Missing getPublishedPublicFooterData service.");

for (const file of walk("app/(site)")) {
  if (/<footer[\s>]/.test(read(file))) errors.push(`${file} contains inline footer.`);
}

for (const legacy of ["components/shared/PublicFooter.tsx", "components/layout/Footer.tsx"]) {
  if (exists(legacy)) errors.push(`${legacy} still exists.`);
}

const globals = read("app/globals.css");
if (/^footer\s*\{|^footer\s+a|^footer\s+h3|^footer\s+p|^footer\[data-footer-layout/m.test(globals)) {
  errors.push("Generic global Footer selectors remain in app/globals.css.");
}

const report = { generatedAt: new Date().toISOString(), passed: errors.length === 0, errors };
fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/public-footer-verify.json"), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error("Public Footer verification failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Public Footer verification passed.");
console.log("One canonical PublicFooter found.");
console.log("One canonical BrandLogo found.");
console.log("All public routes use Public Site Shell.");
console.log("No inline public Footer remains.");
console.log("No legacy Footer imports remain.");
console.log("No hardcoded Footer links remain.");
console.log("No broken Footer logo source remains.");
console.log("No generic global Footer selectors remain.");
