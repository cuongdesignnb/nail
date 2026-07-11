import { NextRequest } from "next/server";
import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { getBusinessSettings, saveBusinessSettings } from "@/lib/settings/settings.service";

const NO_STORE_HEADERS = { "Cache-Control": "no-store, no-cache, must-revalidate", Pragma: "no-cache", Expires: "0" };

function authorize() {
  try { requireAdmin(); return null; } catch (error) { return authErrorResponse(error); }
}

export async function GET() {
  const unauthorized = authorize();
  if (unauthorized) return unauthorized;
  try {
    const result = await getBusinessSettings();
    return Response.json({ success: true, data: result.data, meta: { updatedAt: result.updatedAt } }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error(JSON.stringify({ event: "SETTINGS_LOAD_FAILED", scope: "business", error: error instanceof Error ? error.message : "unknown" }));
    return Response.json({ success: false, error: "Unable to load settings.", code: "DATABASE_ERROR" }, { status: 500, headers: NO_STORE_HEADERS });
  }
}

export async function PUT(request: NextRequest) {
  const unauthorized = authorize();
  if (unauthorized) return unauthorized;
  try {
    const result = await saveBusinessSettings(await request.json());
    return Response.json({ success: true, data: result.data, meta: { updatedAt: result.updatedAt } }, { headers: NO_STORE_HEADERS });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: "Validation failed", code: "VALIDATION_ERROR", issues: error.flatten().fieldErrors }, { status: 400, headers: NO_STORE_HEADERS });
    }
    console.error(JSON.stringify({ event: "SETTINGS_SAVE_FAILED", scope: "business", error: error instanceof Error ? error.message : "unknown" }));
    return Response.json({ success: false, error: "Unable to save settings.", code: "DATABASE_ERROR" }, { status: 500, headers: NO_STORE_HEADERS });
  }
}
