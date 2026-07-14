export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { getPublicSmtpSettings, saveSmtpSettings, smtpSettingsSchema } from "@/lib/email/smtp-config.service";
import { SETTINGS_NO_STORE_HEADERS, settingsFailure, zodIssues } from "@/lib/settings/settings-api";

export async function GET() {
  try {
    requireRole(["Owner"]);
    const data = await getPublicSmtpSettings();
    const record = await prisma.emailSmtpSetting.findUnique({ where: { key: "default" }, select: { updatedAt: true } });
    return Response.json({ success: true, data, meta: { updatedAt: record?.updatedAt.toISOString() ?? new Date(0).toISOString(), updatedBy: null, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    return roleErrorResponse(error) || authErrorResponse(error) || settingsFailure("Unable to load email settings.", "DATABASE_ERROR", 500);
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
    const verify = await getPublicSmtpSettings();
    return Response.json({ success: true, data: verify, meta: { updatedAt: new Date().toISOString(), updatedBy: session.email, publicRevalidated: true } }, { headers: SETTINGS_NO_STORE_HEADERS });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) return settingsFailure("Please correct the highlighted fields.", "VALIDATION_ERROR", 400, zodIssues(error));
    return settingsFailure(error instanceof Error ? error.message : "Unable to save email settings.", "DATABASE_ERROR", 400);
  }
}
