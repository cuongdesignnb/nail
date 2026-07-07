export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { TransactionalEmailKind } from "@prisma/client";
import { emailTestMessage } from "@/emails/EmailTestMessage";
import { authErrorResponse } from "@/lib/auth/require-admin";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { sendTransactionalEmail } from "@/lib/email/mail.service";

const schema = z.object({ to: z.string().trim().email().max(160) });

export async function POST(req: Request) {
  try {
    requireRole(["Owner"]);
    const { to } = schema.parse(await req.json());
    const email = emailTestMessage();
    await sendTransactionalEmail({
      kind: TransactionalEmailKind.SMTP_TEST,
      to,
      subject: email.subject,
      html: email.html,
      entityType: "EmailSmtpSetting",
      entityId: "default",
    });
    return Response.json({ success: true, message: "Test email sent." });
  } catch (error) {
    const role = roleErrorResponse(error);
    if (role) return role;
    const auth = authErrorResponse(error);
    if (auth) return auth;
    if (error instanceof z.ZodError) return Response.json({ success: false, error: "Validation failed", issues: error.issues }, { status: 400 });
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to send test email." }, { status: 400 });
  }
}
