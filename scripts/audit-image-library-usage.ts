import fs from "fs";
import path from "path";
import ts from "typescript";

type Finding = {
  filePath: string;
  line: number;
  matchedText: string;
  status: "pending" | "exception";
  requiredReplacement: string;
};

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "data"];
const REPORT_DIR = path.join(ROOT, "reports");
const JSON_REPORT = path.join(REPORT_DIR, "image-library-audit.json");
const MD_REPORT = path.join(REPORT_DIR, "image-library-audit.md");
const EXCEPTIONS = [
  "components/admin/media/ExternalImageImportDialog.tsx",
  "components/admin/media-library/MediaUploadForm.tsx",
];
const FILE_EXCEPTIONS = [
  "components/admin/editor/RichTextLinkDialog.tsx",
  "components/admin/settings/SalonInfoSettings.tsx",
];

const imageFieldPattern = /\b(?:imageUrl|imagePath|imageSrc|thumbnailUrl|coverImageUrl|bannerImageUrl|avatarUrl|ogImageUrl)\b/i;
const imageUrlLabelPattern = /image\s+(?:url|path)/i;
const inputTags = new Set(["input", "textarea", "Input", "TextInput", "FormInput"]);

function walk(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!/\.(tsx|ts|jsx|js|json)$/.test(entry.name)) return [];
    return [full];
  });
}

function toRepoPath(filePath: string) {
  return path.relative(ROOT, filePath).replace(/\\/g, "/");
}

function collectDirectImageInputs(filePath: string, content: string) {
  const extension = path.extname(filePath).toLowerCase();
  if (![".tsx", ".jsx"].includes(extension)) return [];
  const source = ts.createSourceFile(
    filePath,
    content,
    ts.ScriptTarget.Latest,
    true,
    extension === ".tsx" ? ts.ScriptKind.TSX : ts.ScriptKind.JSX,
  );
  const matches: Array<{ line: number; matchedText: string }> = [];

  function visit(node: ts.Node) {
    if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
      const tag = node.tagName.getText(source);
      if (inputTags.has(tag)) {
        const control = node.getText(source);
        const hasImageBinding = imageFieldPattern.test(control);
        const hasImageUrlLabel = imageUrlLabelPattern.test(control);
        if (hasImageBinding || hasImageUrlLabel) {
          matches.push({
            line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1,
            matchedText: control.replace(/\s+/g, " ").trim().slice(0, 220),
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  return matches;
}

function main() {
  const findings: Finding[] = [];
  for (const dir of SCAN_DIRS) {
    for (const file of walk(path.join(ROOT, dir))) {
      const repoPath = toRepoPath(file);
      if (FILE_EXCEPTIONS.includes(repoPath)) continue;
      const content = fs.readFileSync(file, "utf8");
      collectDirectImageInputs(file, content).forEach((match) => {
        findings.push({
          filePath: repoPath,
          line: match.line,
          matchedText: match.matchedText,
          status: EXCEPTIONS.includes(repoPath) ? "exception" : "pending",
          requiredReplacement: "Replace direct image URL editing with MediaPickerField or MediaGalleryPickerField.",
        });
      });
    }
  }

  fs.mkdirSync(REPORT_DIR, { recursive: true });
  fs.writeFileSync(JSON_REPORT, JSON.stringify({ generatedAt: new Date().toISOString(), findings }, null, 2));
  fs.writeFileSync(
    MD_REPORT,
    [
      "# Image Library Audit",
      "",
      `Generated: ${new Date().toISOString()}`,
      "",
      `Findings: ${findings.length}`,
      "",
      "| Status | File | Line | Match | Required Replacement |",
      "|---|---|---:|---|---|",
      ...findings.map((finding) =>
        `| ${finding.status} | ${finding.filePath} | ${finding.line} | \`${finding.matchedText.replace(/\|/g, "\\|")}\` | ${finding.requiredReplacement} |`
      ),
      "",
    ].join("\n")
  );

  const pending = findings.filter((finding) => finding.status === "pending").length;
  console.log(`${pending === 0 ? "PASS" : "FAIL"} Image Library audit: ${pending} pending, ${findings.length - pending} documented exceptions.`);
  if (pending > 0) process.exitCode = 1;
}

main();
