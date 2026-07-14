import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const roots = ["app/(site)", "app/api/public", "components/home", "components/public", "components/booking"];
const failures: string[] = [];
for (const folder of roots) {
  const full = path.join(root, folder);
  if (!fs.existsSync(full)) continue;
  const stack = [full];
  while (stack.length) {
    const current = stack.pop()!;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const file = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(file);
      else if (/\.(ts|tsx)$/.test(file)) {
        const source = fs.readFileSync(file, "utf8");
        if (/import\s+\{[^}]*\bbusiness\b[^}]*\}\s+from\s+["'][^"']*lib\/data["']/.test(source)) failures.push(path.relative(root, file));
      }
    }
  }
}
if (failures.length) {
  console.error(`FAIL public runtime imports business settings from lib/data.ts: ${failures.join(", ")}`);
  process.exitCode = 1;
} else console.log("PASS public production components do not import business settings from lib/data.ts");
