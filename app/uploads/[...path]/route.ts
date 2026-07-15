import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const CONTENT_TYPES: Record<string, string> = {
  ".avif": "image/avif",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

function resolveUploadPath(segments: string[]) {
  if (!segments.length || segments.some((segment) => !segment || segment === "." || segment === ".." || segment.includes("\\"))) {
    return null;
  }
  const root = path.resolve(process.env.LOCAL_UPLOAD_DIR || path.join(process.cwd(), "public", "uploads"));
  const resolved = path.resolve(root, ...segments);
  if (resolved !== root && !resolved.startsWith(`${root}${path.sep}`)) return null;
  return resolved;
}

export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } },
) {
  const filePath = resolveUploadPath(params.path);
  if (!filePath) return NextResponse.json({ success: false, error: "Asset not found" }, { status: 404 });

  try {
    const bytes = await readFile(filePath);
    const contentType = CONTENT_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream";
    return new NextResponse(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(bytes.byteLength),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    const code = error && typeof error === "object" && "code" in error ? String(error.code) : "";
    if (code !== "ENOENT") console.error(JSON.stringify({ event: "MEDIA_READ_FAILED", code }));
    return NextResponse.json({ success: false, error: "Asset not found" }, { status: 404 });
  }
}
