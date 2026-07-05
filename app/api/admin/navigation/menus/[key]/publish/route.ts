import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { publishNavigationMenu } from "@/lib/navigation/navigation.service";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest, { params }: { params: { key: string } }) {
  try {
    const session = requireAdmin();
    const data = await publishNavigationMenu(params.key, session.email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("POST navigation menu publish error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to publish menu" }, { status: 422 });
  }
}
