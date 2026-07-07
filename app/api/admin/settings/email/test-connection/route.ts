export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { verifySmtpConnection } from "@/lib/email/smtp-config.service";

export async function POST() {
  try {
    requireRole(["Owner"]);
    const data = await verifySmtpConnection();
    return Response.json({ success: true, data, message: "SMTP connection verified successfully." });
  } catch (error) {
    return roleErrorResponse(error) || authErrorResponse(error) || Response.json({ success: false, error: "Unable to connect to SMTP. Check host, port, encryption and credentials.", detail: error instanceof Error ? error.message : undefined }, { status: 400 });
  }
}
