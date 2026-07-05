import fs from "fs";
import path from "path";

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

const forbiddenPatterns = [
  /Image URL/i,
  /Image Path/i,
  /imageUrl/i,
  /imagePath/i,
  /imageSrc/i,
  /thumbnailUrl/i,
  /coverImageUrl/i,
  /bannerImageUrl/i,
  /avatarUrl/i,
  /ogImageUrl/i,
  /type=["']url["']/i,
];

const allowedContext = [
  /CTA|button|href|social|facebook|instagram|tiktok|canonical|map|mailto|tel|booking|external article/i,
];

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

function main() {
  const findings: Finding[] = [];
  for (const dir of SCAN_DIRS) {
    for (const file of walk(path.join(ROOT, dir))) {
      const repoPath = toRepoPath(file);
      if (FILE_EXCEPTIONS.includes(repoPath)) continue;
      const content = fs.readFileSync(file, "utf8");
      content.split(/\r?\n/).forEach((lineText, index) => {
        if (!forbiddenPatterns.some((pattern) => pattern.test(lineText))) return;
        if (allowedContext.some((pattern) => pattern.test(lineText))) return;
        findings.push({
          filePath: repoPath,
          line: index + 1,
          matchedText: lineText.trim().slice(0, 220),
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

  console.log(`Image Library audit complete. ${findings.length} findings written to reports/.`);
}

main();
