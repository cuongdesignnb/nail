import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { getStorageAdapter } from "@/lib/storage";
import { access } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    requireAdmin();
    const ids = (new URL(request.url).searchParams.get("ids") || "")
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean)
      .slice(0, 100);
    const assets = await prisma.mediaAsset.findMany({
      where: { id: { in: ids }, isDeleted: false },
      select: { id: true, storageKey: true, provider: true, url: true },
    });
    const activeProvider = process.env.STORAGE_PROVIDER || "local";
    const storage = getStorageAdapter();
    const entries = await Promise.all(assets.map(async (asset) => {
      if (asset.url.startsWith("/") && !asset.url.startsWith("/uploads/")) {
        try {
          await access(path.resolve(process.cwd(), "public", asset.url.replace(/^\/+/, "")));
          return [asset.id, "uploaded"] as const;
        } catch {
          return [asset.id, "missing-file"] as const;
        }
      }
      if (!asset.storageKey) return [asset.id, "missing-file"] as const;
      if (asset.provider === "external") return [asset.id, "uploaded"] as const;
      if ((asset.provider || "local") !== activeProvider) return [asset.id, "failed"] as const;
      try {
        return [asset.id, await storage.exists(asset.storageKey) ? "uploaded" : "missing-file"] as const;
      } catch {
        return [asset.id, "failed"] as const;
      }
    }));
    return NextResponse.json({ success: true, data: Object.fromEntries(entries) });
  } catch (error) {
    const authResponse = authErrorResponse(error);
    if (authResponse) return authResponse;
    return NextResponse.json({ success: false, error: "Unable to verify media storage." }, { status: 500 });
  }
}
