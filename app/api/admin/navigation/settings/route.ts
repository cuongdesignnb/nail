import { NextRequest, NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { getNavigationSettings, updateNavigationSettings } from "@/lib/navigation/navigation.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    requireAdmin();
    const data = await getNavigationSettings();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("GET navigation settings error:", error);
    return NextResponse.json({ success: false, error: "Failed to load navigation settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = requireAdmin();
    if (session.role !== "Owner") {
      return NextResponse.json({ success: false, error: "Only owners can update menu location settings." }, { status: 403 });
    }
    const body = await req.json();
    const data = await updateNavigationSettings(body, session.email);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("PUT navigation settings error:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Failed to update navigation settings" }, { status: 422 });
  }
}
