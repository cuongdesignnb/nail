import { PromotionEmailStatus, TransactionalEmailKind } from "@prisma/client";
import { promotionVoucherEmail } from "@/emails/PromotionVoucherEmail";
import { prisma } from "@/lib/db";
import { sendTransactionalEmail } from "@/lib/email/mail.service";

function dateLabel(date: Date | null | undefined) {
  return date ? date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Please ask our team for details.";
}

export async function sendPromotionVoucherEmail(leadId: string) {
  const lead = await prisma.promotionLead.findUnique({
    where: { id: leadId },
    include: {
      campaign: { include: { emailTemplate: true } },
      voucherCode: true,
    },
  });
  if (!lead || !lead.voucherCode) throw new Error("Promotion lead or voucher was not found.");
  const template = lead.campaign.emailTemplate;
  const rendered = promotionVoucherEmail({
    customerName: lead.fullName,
    campaignTitle: lead.campaign.title,
    offerSummary: lead.campaign.description || lead.campaign.subtitle || lead.campaign.title,
    voucherCode: lead.voucherCode.code,
    expiresAt: dateLabel(lead.voucherCode.expiresAt),
    subject: template?.subject,
    bodyHtml: template?.bodyHtml,
    bodyText: template?.bodyText,
    buttonLabel: template?.buttonLabel,
    buttonUrl: template?.buttonUrl,
  });

  try {
    const log = await sendTransactionalEmail({
      kind: TransactionalEmailKind.PROMOTION_VOUCHER,
      to: lead.email,
      subject: rendered.subject,
      html: rendered.html,
      text: rendered.text,
      entityType: "PromotionLead",
      entityId: lead.id,
      metadata: { campaignId: lead.campaignId, voucherCodeId: lead.voucherCode.id },
    });
    const sent = log.status === "SENT";
    await prisma.promotionLead.update({
      where: { id: lead.id },
      data: {
        emailStatus: sent ? PromotionEmailStatus.SENT : PromotionEmailStatus.FAILED,
        emailSentAt: sent ? new Date() : null,
        emailError: sent ? null : log.lastError || "SMTP delivery failed.",
      },
    });
    return sent;
  } catch (error) {
    await prisma.promotionLead.update({
      where: { id: lead.id },
      data: {
        emailStatus: PromotionEmailStatus.FAILED,
        emailError: error instanceof Error ? error.message.slice(0, 500) : "SMTP delivery failed.",
      },
    }).catch(() => undefined);
    return false;
  }
}
