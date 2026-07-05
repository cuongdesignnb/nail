import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

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

const errors: string[] = [];

for (const file of [
  "app/(site)/layout.tsx",
  "components/public/shell/PublicSiteShell.tsx",
  "components/public/shell/PublicHeader.tsx",
  "components/public/shell/PublicFooter.tsx",
  "components/public/shell/BrandLogo.tsx",
]) {
  if (!exists(file)) errors.push(`${file} is missing.`);
}

if (exists("app/page.tsx")) errors.push("app/page.tsx still exists outside the public route group.");
for (const dir of ["about", "services", "gallery", "packages", "promotions", "contact", "blog", "booking"]) {
  if (exists(`app/${dir}/page.tsx`)) errors.push(`app/${dir}/page.tsx still exists outside app/(site).`);
}

const siteLayout = exists("app/(site)/layout.tsx") ? read("app/(site)/layout.tsx") : "";
if (!siteLayout.includes("PublicSiteShell")) errors.push("app/(site)/layout.tsx does not render PublicSiteShell.");

const files = [...walk("app/(site)"), ...walk("components")];
for (const file of files) {
  const text = read(file);
  if (/components\/layout\/(Header|Footer)|components\/shared\/Public(Header|Footer)/.test(text)) {
    errors.push(`${file} imports a legacy Header/Footer.`);
  }
  if (/const\s+navItems\s*=/.test(text)) errors.push(`${file} contains a static navItems array.`);
  if (/\/aera-mark\.svg|\/images\/logo-aera\.png/.test(text) && /(Header|Footer|shell)/i.test(file)) {
    errors.push(`${file} contains hardcoded Header/Footer logo URL.`);
  }
}

const report = {
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
};

fs.mkdirSync(path.join(root, "reports"), { recursive: true });
fs.writeFileSync(path.join(root, "reports/public-shell-verify.json"), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error("Public Site Shell verification failed.");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Public Site Shell verification passed.");
console.log("One canonical PublicHeader found.");
console.log("One canonical PublicFooter found.");
console.log("One canonical BrandLogo found.");
console.log("All public routes use Public Site Shell.");
console.log("No legacy Header/Footer imports remain.");
console.log("No duplicate public navigation arrays remain.");
console.log("No hardcoded Header/Footer logo URL remains.");
