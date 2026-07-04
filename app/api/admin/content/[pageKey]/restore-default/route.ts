import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { isValidPageKey } from "@/lib/content/content-registry";
import { restoreDefault } from "@/lib/content/content.repository";
import type { ContentPageKey } from "@/lib/content/content.types";

export async function POST(
  _request: NextRequest,
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

    const updated = await restoreDefault({
      pageKey: pageKey as ContentPageKey,
      actor: admin.email,
    });

    return NextResponse.json(
      { success: true, data: { version: updated.version } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("POST admin/content/[pageKey]/restore-default error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore default content" },
      { status: 500 }
    );
  }
}
