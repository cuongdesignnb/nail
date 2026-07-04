import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { isValidPageKey } from "@/lib/content/content-registry";
import { publishContent } from "@/lib/content/content.repository";
import { revalidateContentCache } from "@/lib/content/content-cache";
import type { ContentPageKey } from "@/lib/content/content.types";

export async function POST(
  request: NextRequest,
  { params }: { params: { pageKey: string } }
) {
  let admin;
  try {
    admin = requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const { pageKey } = params;

    if (!isValidPageKey(pageKey)) {
      return NextResponse.json(
        { success: false, error: "Invalid page key" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { version } = body as { version: number };

    if (typeof version !== "number") {
      return NextResponse.json(
        { success: false, error: "Missing required field: version" },
        { status: 400 }
      );
    }

    const updated = await publishContent({
      pageKey: pageKey as ContentPageKey,
      version,
      actor: admin.email,
    });

    revalidateContentCache(pageKey as ContentPageKey);

    return NextResponse.json(
      { success: true, data: { version: updated.version } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof Error && error.name === "VERSION_CONFLICT") {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 409 }
      );
    }

    console.error("POST admin/content/[pageKey]/publish error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to publish content" },
      { status: 500 }
    );
  }
}
