export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { smtpErrorCode } from "@/lib/email/smtp-crypto";
import { smtpSettingsSchema, verifySmtpConnection } from "@/lib/email/smtp-config.service";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    requireRole(["Owner"]);
    const input = smtpSettingsSchema.parse(await req.json());
    const data = await verifySmtpConnection(input);
    return Response.json({ success: true, data, message: "SMTP connection verified successfully." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({
        success: false,
        error: "Unable to connect to SMTP.",
        code: "SMTP_INVALID_CONFIG",
        detail: error.issues[0]?.message || "SMTP settings are incomplete.",
      }, { status: 400 });
    }
    return roleErrorResponse(error) || authErrorResponse(error) || Response.json({
      success: false,
      error: "Unable to connect to SMTP.",
      code: smtpErrorCode(error),
      detail: error instanceof Error ? error.message : "Check host, port, encryption mode and credentials.",
    }, { status: 400 });
  }
}
