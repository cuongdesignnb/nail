import { authErrorResponse, requireAdmin } from "./require-admin";

export const ADMIN_NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export function requireAdminApi(): Response | null {
  try {
    requireAdmin();
    return null;
  } catch (error) {
    return authErrorResponse(error) ?? Response.json(
      { success: false, error: "Unauthorized", code: "UNAUTHORIZED" },
      { status: 401, headers: ADMIN_NO_STORE_HEADERS }
    );
  }
}

