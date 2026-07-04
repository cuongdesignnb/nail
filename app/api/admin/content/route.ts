import { NextResponse } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { getAllPageMeta } from "@/lib/content/content.repository";
import { getContentRegistry } from "@/lib/content/content-registry";

export async function GET() {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const pages = await getAllPageMeta();

    return NextResponse.json(
      {
        success: true,
        data: {
          pages,
          registry: getContentRegistry(),
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("GET admin/content error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load page metadata" },
      { status: 500 }
    );
  }
}
