import { NextResponse } from "next/server";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { getSeoAuditRows } from "@/lib/seo/audit.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    requireRole(["Owner", "Manager"]);
    const rows = await getSeoAuditRows();
    return NextResponse.json({ success: true, data: rows });
  } catch (error) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

