import { NextResponse } from "next/server";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { validateLegacySchemaJson } from "@/lib/seo/seo.validation";

export async function POST(req: Request) {
  try {
    requireRole(["Owner", "Manager"]);
    const body = await req.json();
    const result = validateLegacySchemaJson(body.schemaJson ?? body);
    return NextResponse.json({ success: result.valid, ...result }, { status: result.valid ? 200 : 422 });
  } catch (error) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

