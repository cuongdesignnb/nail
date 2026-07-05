import { NextResponse } from "next/server";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { listNavigationMenus } from "@/lib/navigation/navigation.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    requireAdmin();
    const data = await listNavigationMenus();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return auth;
    console.error("GET navigation menus error:", error);
    return NextResponse.json({ success: false, error: "Failed to load navigation menus" }, { status: 500 });
  }
}
