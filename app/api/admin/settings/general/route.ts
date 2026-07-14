import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { generalSettingsSchema } from "@/lib/settings/schemas/general.schema";
import { getBusinessSettings, saveBusinessSettings } from "@/lib/settings/settings.service";
import { revalidateSettingsConsumers } from "@/lib/settings/settings-cache";
import { SETTINGS_NO_STORE_HEADERS, settingsFailure, zodIssues } from "@/lib/settings/settings-api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    requireAdmin();
    const result = await getBusinessSettings();
    return Response.json({ success: true, data: result.data, meta: { updatedAt: result.updatedAt, updatedBy: null, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return settingsFailure("Authentication is required.", auth.status === 403 ? "FORBIDDEN" : "UNAUTHORIZED", auth.status);
    return settingsFailure("Unable to load settings.", "DATABASE_ERROR", 500);
  }
}

export async function PUT(request: Request) {
  try {
    requireAdmin();
    const body = await request.json() as Record<string, unknown>;
    const data = generalSettingsSchema.parse(body.data && typeof body.data === "object" ? body.data : body);
    const result = await saveBusinessSettings(data);
    revalidateSettingsConsumers(["general"]);
    return Response.json({ success: true, data: result.data, meta: { updatedAt: result.updatedAt, updatedBy: null, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const auth = authErrorResponse(error);
    if (auth) return settingsFailure("Authentication is required.", auth.status === 403 ? "FORBIDDEN" : "UNAUTHORIZED", auth.status);
    if (error instanceof z.ZodError) return settingsFailure("Please correct the highlighted fields.", "VALIDATION_ERROR", 400, zodIssues(error));
    return settingsFailure("Unable to save settings.", "DATABASE_ERROR", 500);
  }
}
