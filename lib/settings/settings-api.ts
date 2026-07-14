import { z } from "zod";
import type { AdminSettingsErrorCode } from "./settings.types";
import { zodFieldErrors } from "./settings-validation-errors";

export const SETTINGS_NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export function zodIssues(error: z.ZodError): Record<string, string[]> {
  return zodFieldErrors(error);
}

export function settingsFailure(
  error: string,
  code: AdminSettingsErrorCode,
  status: number,
  issues?: Record<string, string[]>,
) {
  return Response.json(
    { success: false, error, code, ...(issues ? { issues } : {}) },
    { status, headers: SETTINGS_NO_STORE_HEADERS },
  );
}
