import { TransactionalEmailKind, TransactionalEmailStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getRuntimeSmtpConfig } from "./smtp-config.service";
import { sanitizeMailError } from "./smtp-crypto";
import { createSmtpTransporter } from "./smtp-transporter";
import type { SendTransactionalEmailInput } from "./mail.types";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";

function backoff(attempts: number) {
  return new Date(Date.now() + Math.min(60, 2 ** Math.max(1, attempts)) * 60_000);
}

export async function sendTransactionalEmail(input: SendTransactionalEmailInput) {
  const publicSettings = await getPublicSiteSettings();
  const escapedBrand = publicSettings.brand.name.replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character] || character));
  const logo = publicSettings.brand.logo?.src
    ? `<img src="${publicSettings.brand.logo.src}" alt="${publicSettings.brand.logo.alt}" style="display:block;max-width:180px;max-height:70px;margin-bottom:12px" />`
    : "";
  const brandedInput = {
    ...input,
    subject: input.subject.replaceAll("Aera Nail Lounge", publicSettings.brand.name),
    html: input.html
      .replace("<div style=\"font-family:Georgia,serif;font-size:28px;font-weight:700;color:#7a4f32\">", `${logo}<div style="font-family:Georgia,serif;font-size:28px;font-weight:700;color:#7a4f32">`)
      .replaceAll("Aera Nail Lounge", escapedBrand)
      .replace("Los Angeles</div>", `${publicSettings.contact.address}</div>`),
    text: input.text?.replaceAll("Aera Nail Lounge", publicSettings.brand.name),
  };
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
      subject: brandedInput.subject,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: { ...(input.metadata || {}), html: brandedInput.html, text: brandedInput.text },
    },
  });
  return attemptTransactionalEmail(log.id, brandedInput);
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
