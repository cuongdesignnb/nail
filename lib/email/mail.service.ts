import { TransactionalEmailKind, TransactionalEmailStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getRuntimeSmtpConfig } from "./smtp-config.service";
import { sanitizeMailError } from "./smtp-crypto";
import { createSmtpTransporter } from "./smtp-transporter";
import type { SendTransactionalEmailInput } from "./mail.types";

function backoff(attempts: number) {
  return new Date(Date.now() + Math.min(60, 2 ** Math.max(1, attempts)) * 60_000);
}

export async function sendTransactionalEmail(input: SendTransactionalEmailInput) {
  const shouldDedupe = input.kind !== TransactionalEmailKind.SMTP_TEST;
  const existing = shouldDedupe && input.entityType && input.entityId
    ? await prisma.transactionalEmailLog.findFirst({
        where: {
          kind: input.kind,
          recipient: input.to,
          entityType: input.entityType,
          entityId: input.entityId,
          status: TransactionalEmailStatus.SENT,
        },
      }).catch(() => null)
    : null;
  if (existing) return existing;

  const log = await prisma.transactionalEmailLog.create({
    data: {
      kind: input.kind,
      recipient: input.to,
      subject: input.subject,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: { ...(input.metadata || {}), html: input.html, text: input.text },
    },
  });
  return attemptTransactionalEmail(log.id, input);
}

export async function attemptTransactionalEmail(logId: string, payload?: SendTransactionalEmailInput) {
  const config = await getRuntimeSmtpConfig(true);
  if (!config?.enabled) {
    const safe = "SMTP is not configured or verified.";
    return prisma.transactionalEmailLog.update({
      where: { id: logId },
      data: { status: TransactionalEmailStatus.FAILED, attempts: { increment: 1 }, lastAttemptAt: new Date(), lastError: safe, nextRetryAt: backoff(1) },
    });
  }

  const log = await prisma.transactionalEmailLog.update({
    where: { id: logId },
    data: { status: TransactionalEmailStatus.SENDING, attempts: { increment: 1 }, lastAttemptAt: new Date() },
  });

  const html = payload?.html || String((log.metadata as Record<string, unknown> | null)?.html || "");
  const text = payload?.text;
  try {
    await createSmtpTransporter(config).sendMail({
      from: `"${config.fromName}" <${config.fromEmail}>`,
      replyTo: config.replyToEmail,
      to: log.recipient,
      subject: log.subject,
      html,
      text,
    });
    return prisma.transactionalEmailLog.update({
      where: { id: logId },
      data: { status: TransactionalEmailStatus.SENT, sentAt: new Date(), lastError: null, nextRetryAt: null },
    });
  } catch (error) {
    const safe = sanitizeMailError(error);
    return prisma.transactionalEmailLog.update({
      where: { id: logId },
      data: {
        status: TransactionalEmailStatus.FAILED,
        lastError: safe,
        nextRetryAt: log.attempts + 1 >= 3 ? null : backoff(log.attempts + 1),
      },
    });
  }
}
