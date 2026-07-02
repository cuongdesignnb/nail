import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export type AdminSession = {
  email: string;
  role: "Owner" | "Manager" | "Receptionist" | "Technician";
};

const allowedRoles = new Set(["Owner", "Manager"]);

export function getAuthSecret() {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "local-development-secret";
}

export function signAdminSession(session: AdminSession) {
  return jwt.sign(session, getAuthSecret(), { expiresIn: "8h" });
}

export function requireAdmin(): AdminSession {
  const token = cookies().get("aera_admin_session")?.value;
  if (!token) {
    const error = new Error("UNAUTHORIZED");
    error.name = "UNAUTHORIZED";
    throw error;
  }

  try {
    const payload = jwt.verify(token, getAuthSecret()) as AdminSession;
    if (!allowedRoles.has(payload.role)) {
      const error = new Error("FORBIDDEN");
      error.name = "FORBIDDEN";
      throw error;
    }
    return payload;
  } catch (error) {
    if (error instanceof Error && error.name === "FORBIDDEN") throw error;
    const unauthorized = new Error("UNAUTHORIZED");
    unauthorized.name = "UNAUTHORIZED";
    throw unauthorized;
  }
}

export function authErrorResponse(error: unknown) {
  if (error instanceof Error && error.name === "FORBIDDEN") {
    return Response.json({ success: false, error: "Forbidden" }, { status: 403 });
  }
  if (error instanceof Error && error.name === "UNAUTHORIZED") {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
