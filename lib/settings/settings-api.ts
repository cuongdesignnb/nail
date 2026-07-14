import { z } from "zod";
import type { AdminSettingsErrorCode } from "./settings.types";

export const SETTINGS_NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export function zodIssues(error: z.ZodError): Record<string, string[]> {
  const issues: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const key = issue.path.length ? issue.path.join(".") : "form";
    issues[key] = [...(issues[key] ?? []), issue.message];
  }
  return issues;
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
