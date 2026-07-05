import { NextRequest } from "next/server";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { getEntityOptions } from "@/lib/content/content-options.service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    requireAdmin();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("entity") ?? searchParams.get("type");
    if (!type) {
      return Response.json({ success: false, error: "Missing entity parameter" }, { status: 400 });
    }
    const data = await getEntityOptions(type);
    return Response.json({ success: true, data });
  } catch (error) {
    const authErr = authErrorResponse(error);
    if (authErr) return authErr;
    console.error("Error fetching admin options:", error);
    return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
