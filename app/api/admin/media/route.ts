import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { mediaListQuerySchema } from "@/lib/validations/media.schema";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    requireAdmin();

    const { searchParams } = new URL(req.url);
    const query = mediaListQuerySchema.parse({
      search: searchParams.get("search") || undefined,
      folder: searchParams.get("folder") || undefined,
      mimeType: searchParams.get("mimeType") || undefined,
      page: searchParams.get("page") || 1,
      pageSize: searchParams.get("pageSize") || 24,
      sort: searchParams.get("sort") || "newest",
    });

    const where: Record<string, unknown> = { isDeleted: false };

    if (query.folder) {
      where.folder = query.folder;
    }

    if (query.mimeType) {
      where.mimeType = query.mimeType;
    }

    if (query.search) {
      where.OR = [
        { fileName: { contains: query.search, mode: "insensitive" } },
        { originalName: { contains: query.search, mode: "insensitive" } },
        { alt: { contains: query.search, mode: "insensitive" } },
        { title: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const orderMap: Record<string, Record<string, string>> = {
      newest: { createdAt: "desc" },
      oldest: { createdAt: "asc" },
      name: { fileName: "asc" },
      size: { size: "desc" },
    };

    const orderBy = orderMap[query.sort] || orderMap.newest;
    const skip = (query.page - 1) * query.pageSize;

    const [items, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where,
        orderBy,
        skip,
        take: query.pageSize,
      }),
      prisma.mediaAsset.count({ where }),
    ]);

    const normalizedItems = items.map((item) => ({
      ...item,
      url: normalizeMediaUrl(item.url),
    }));

    return NextResponse.json({
      success: true,
      data: {
        items: normalizedItems,
        total,
        page: query.page,
        pageSize: query.pageSize,
        totalPages: Math.ceil(total / query.pageSize),
      },
    });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;
    console.error("GET /api/admin/media error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
