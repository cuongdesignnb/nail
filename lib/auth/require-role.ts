// ---------------------------------------------------------------------------
// Role-based authorization
// ---------------------------------------------------------------------------

import { requireAdmin, type AdminSession } from "./require-admin";

export type AdminRole = "Owner" | "Manager" | "Receptionist" | "Technician";

/**
 * Permission matrix: which roles can access which modules.
 */
const ROLE_PERMISSIONS: Record<string, AdminRole[]> = {
  dashboard: ["Owner", "Manager", "Receptionist", "Technician"],
  "dashboard:financial": ["Owner", "Manager"],
  bookings: ["Owner", "Manager", "Receptionist"],
  "bookings:own": ["Technician"],
  customers: ["Owner", "Manager", "Receptionist"],
  services: ["Owner", "Manager"],
  "services:read": ["Receptionist"],
  packages: ["Owner", "Manager"],
  inventory: ["Owner", "Manager"],
  "inventory:limited": ["Receptionist"],
  promotions: ["Owner", "Manager"],
  "promotions:read": ["Receptionist"],
  content: ["Owner", "Manager"],
  media: ["Owner", "Manager"],
  seo: ["Owner", "Manager"],
  blog: ["Owner", "Manager"],
  "blog:limited": ["Receptionist"],
  reports: ["Owner", "Manager"],
  "reports:limited": ["Receptionist"],
  settings: ["Owner"],
  "settings:limited": ["Manager"],
  users: ["Owner"],
  reviews: ["Owner", "Manager"],
};

/**
 * Require the current admin session to have one of the allowed roles.
 * Throws a Response with 403 if the role doesn't match.
 */
export function requireRole(allowedRoles: AdminRole[]): AdminSession {
  const session = requireAdmin();
  const userRole = (session.role || "Manager") as AdminRole;

  if (!allowedRoles.includes(userRole)) {
    throw new Response(
      JSON.stringify({
        success: false,
        error: "Forbidden",
        message: `Role '${userRole}' does not have access to this resource`,
      }),
      {
        status: 403,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  return session;
}

/**
 * Check if a role has access to a specific module.
 */
export function hasPermission(role: string, module: string): boolean {
  const allowed = ROLE_PERMISSIONS[module];
  if (!allowed) return false;
  return allowed.includes(role as AdminRole);
}

/**
 * Convert a thrown Response (from requireRole) to a NextResponse.
 */
export function roleErrorResponse(error: unknown): Response | null {
  if (error instanceof Response) return error;
  return null;
}
