export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { getPublicSmtpSettings, saveSmtpSettings, smtpSettingsSchema } from "@/lib/email/smtp-config.service";

export async function GET() {
  try {
    requireRole(["Owner"]);
    return Response.json({ success: true, data: await getPublicSmtpSettings() }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return roleErrorResponse(error) || authErrorResponse(error) || Response.json({ success: false, error: "Unable to load email settings." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const session = requireRole(["Owner"]);
    const input = smtpSettingsSchema.parse(await req.json());
    const data = await saveSmtpSettings(input);
    await prisma.auditLog.create({
      data: {
        actor: session.email,
        action: "SMTP_SETTINGS_UPDATED",
        entity: "EmailSmtpSetting:default",
        entityType: "EmailSmtpSetting",
        details: { enabled: data.enabled, host: data.host, port: data.port, encryptionMode: data.encryptionMode, fromEmail: data.fromEmail },
      },
    }).catch(() => undefined);
    return Response.json({ success: true, data });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to save email settings." }, { status: 400 });
  }
}
