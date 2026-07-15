import crypto from "crypto";
import { Prisma, PromotionCampaignStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { generateUniqueVoucherCode } from "./voucher-code";
import { sendPromotionVoucherEmail } from "./promotion-email.service";
import type { z } from "zod";
import type { promotionClaimSchema } from "./promotion.validation";

function activeWindowWhere(now = new Date()): Prisma.PromotionCampaignWhereInput {
  return {
    status: PromotionCampaignStatus.ACTIVE,
    OR: [{ startDate: null }, { startDate: { lte: now } }],
    AND: [{ OR: [{ endDate: null }, { endDate: { gte: now } }] }],
  };
}

export function publicCampaignSelect() {
  return {
    id: true,
    title: true,
    subtitle: true,
    eyebrow: true,
    badge: true,
    description: true,
    policyNote: true,
    ctaLabel: true,
    imageUrl: true,
    showOnHomepage: true,
    popupEnabled: true,
    triggerType: true,
    scrollPercent: true,
    delaySeconds: true,
    frequencyHours: true,
    sortOrder: true,
  } satisfies Prisma.PromotionCampaignSelect;
}

export async function listActiveHomepageCampaigns() {
  return prisma.promotionCampaign.findMany({
    where: {
      ...activeWindowWhere(),
      showOnHomepage: true,
      displayLocation: { in: ["HOMEPAGE", "ALL"] },
    },
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    select: publicCampaignSelect(),
  });
}

export async function listActivePromotionCampaigns() {
  return prisma.promotionCampaign.findMany({
    where: {
      ...activeWindowWhere(),
      displayLocation: { in: ["PROMOTIONS_PAGE", "ALL", "HOMEPAGE"] },
    },
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    select: publicCampaignSelect(),
  });
}

export async function getActivePopupCampaign() {
  return prisma.promotionCampaign.findFirst({
    where: {
      ...activeWindowWhere(),
      popupEnabled: true,
      displayLocation: { in: ["POPUP", "ALL", "HOMEPAGE"] },
    },
    orderBy: [{ sortOrder: "asc" }, { startDate: "desc" }],
    select: publicCampaignSelect(),
  });
}

function hashIp(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export async function claimPromotionVoucher(input: z.infer<typeof promotionClaimSchema>, meta: { campaignId: string; ip?: string; userAgent?: string }) {
  const campaign = await prisma.promotionCampaign.findFirst({
    where: { id: meta.campaignId, ...activeWindowWhere() },
    include: { voucherTemplate: true },
  });
  if (!campaign || !campaign.voucherTemplate) {
    return { ok: false as const, status: 404, error: "This promotion is no longer available." };
  }

  const existing = await prisma.promotionLead.findUnique({
    where: { campaignId_email: { campaignId: campaign.id, email: input.email } },
    include: { voucherCode: true },
  });
  if (existing) {
    await sendPromotionVoucherEmail(existing.id).catch(() => false);
    return { ok: true as const, emailSent: true, message: "We've sent your voucher to your email." };
  }

  const expiresAt = new Date(Date.now() + campaign.voucherTemplate.expiresInDays * 24 * 60 * 60 * 1000);
  const code = await generateUniqueVoucherCode(campaign.voucherTemplate.codePrefix);
  const lead = await prisma.promotionLead.create({
    data: {
      campaignId: campaign.id,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      consentAccepted: input.consentAccepted,
      sourcePage: input.sourcePage || "/",
      ipHash: meta.ip ? hashIp(meta.ip) : null,
      userAgent: meta.userAgent?.slice(0, 300),
      voucherCode: {
        create: {
          campaignId: campaign.id,
          code,
          codePrefix: campaign.voucherTemplate.codePrefix,
          discountType: campaign.voucherTemplate.discountType,
          discountValue: campaign.voucherTemplate.discountValue,
          expiresAt,
        },
      },
    },
  });

  const emailSent = await sendPromotionVoucherEmail(lead.id);
  return {
    ok: true as const,
    emailSent,
    message: emailSent ? "Your voucher has been sent to your email." : "Your request was received. Our team will contact you soon.",
  };
}
