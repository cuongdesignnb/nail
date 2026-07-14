import { z } from "zod";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import type { GlobalSettingsSection } from "./settings.types";
import type { GlobalSettingsSliceMap } from "./global-settings.service";
import {
  getGlobalSettingsSlice,
  saveAndPublishGlobalSettingsSlice,
} from "./global-settings.service";
import { revalidateSettingsConsumers } from "./settings-cache";
import {
  SETTINGS_NO_STORE_HEADERS,
  settingsFailure,
  zodIssues,
} from "./settings-api";

function authFailure(error: unknown) {
  const response = authErrorResponse(error);
  if (!response) return null;
  const forbidden = response.status === 403;
  return settingsFailure(
    forbidden ? "You do not have permission to change these settings." : "Authentication is required.",
    forbidden ? "FORBIDDEN" : "UNAUTHORIZED",
    response.status,
  );
}

export async function handleGlobalSettingsGet<S extends GlobalSettingsSection>(section: S) {
  try {
    requireAdmin();
    const result = await getGlobalSettingsSlice(section);
    return Response.json({
      success: true,
      data: result.data,
      meta: {
        version: result.version,
        updatedAt: result.updatedAt,
        updatedBy: result.updatedBy,
        publicRevalidated: true,
      },
    }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const auth = authFailure(error);
    if (auth) return auth;
    console.error(JSON.stringify({ event: "SETTINGS_LOAD_FAILED", section, error: error instanceof Error ? error.message : "unknown" }));
    return settingsFailure("Unable to load settings.", "DATABASE_ERROR", 500);
  }
}

export async function handleGlobalSettingsPut<S extends GlobalSettingsSection>(input: {
  request: Request;
  section: S;
  schema: z.ZodTypeAny;
  mapPatch?: (parsed: unknown) => GlobalSettingsSliceMap[S];
}) {
  try {
    const admin = requireAdmin();
    const body = await input.request.json() as Record<string, unknown>;
    const expectedVersion = typeof body.expectedVersion === "number" ? body.expectedVersion : undefined;
    const submitted = body.data && typeof body.data === "object" ? body.data : body;
    const parsed = input.schema.parse(submitted);
    const patch = input.mapPatch
      ? input.mapPatch(parsed)
      : parsed as GlobalSettingsSliceMap[S];
    const result = await saveAndPublishGlobalSettingsSlice({
      section: input.section,
      patch,
      actor: admin.email,
      expectedVersion,
    });

    try {
      revalidateSettingsConsumers([input.section]);
    } catch (error) {
      console.error(JSON.stringify({ event: "SETTINGS_PUBLIC_REVALIDATION_FAILED", section: input.section, error: error instanceof Error ? error.message : "unknown" }));
      return settingsFailure("Settings were saved, but public cache refresh failed.", "PUBLIC_REVALIDATION_FAILED", 500);
    }

    return Response.json({
      success: true,
      data: result.data,
      meta: {
        version: result.version,
        updatedAt: result.updatedAt,
        updatedBy: result.updatedBy,
        publicRevalidated: true,
      },
    }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const auth = authFailure(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) {
      return settingsFailure("Please correct the highlighted fields.", "VALIDATION_ERROR", 400, zodIssues(error));
    }
    if (error && typeof error === "object" && "zodError" in error && error.zodError instanceof z.ZodError) {
      return settingsFailure("The merged global settings are invalid.", "VALIDATION_ERROR", 400, zodIssues(error.zodError));
    }
    const named = error as Error & { field?: string };
    if (named.name === "VERSION_CONFLICT") return settingsFailure(named.message, "VERSION_CONFLICT", 409);
    if (named.name === "MEDIA_REFERENCE_ERROR") {
      return settingsFailure(named.message, "VALIDATION_ERROR", 400, { [named.field ?? "logo"]: [named.message] });
    }
    if (named.name === "PERSISTENCE_VERIFICATION_FAILED") {
      return settingsFailure(named.message, "PERSISTENCE_VERIFICATION_FAILED", 500);
    }
    console.error(JSON.stringify({ event: "SETTINGS_SAVE_FAILED", section: input.section, error: named.message || "unknown" }));
    return settingsFailure("Unable to save settings.", "DATABASE_ERROR", 500);
  }
}
