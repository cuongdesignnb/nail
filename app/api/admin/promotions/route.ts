import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { z } from "zod";
import { promotionCampaignSchema } from "@/lib/promotions/promotion.validation";

export const dynamic = "force-dynamic";

function toDate(value?: string | null) {
  return value ? new Date(value) : null;
}

function decimalOrNull(value?: number | null) {
  return value === null || value === undefined ? null : value;
}

export async function GET(req: NextRequest) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const where = status && status !== "ALL" ? { status: status as any } : {};
    const campaigns = await prisma.promotionCampaign.findMany({
      where,
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      include: {
        voucherTemplate: true,
        emailTemplate: true,
        _count: { select: { leads: true, vouchers: true } },
      },
    });
    return Response.json({ success: true, data: campaigns }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Promotion campaigns list error:", error);
    return Response.json({ success: false, error: "Failed to fetch promotion campaigns" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const body = await req.json();
    const data = promotionCampaignSchema.parse(body);
    const campaign = await prisma.promotionCampaign.create({
      data: {
        title: data.title,
        subtitle: data.subtitle || null,
        eyebrow: data.eyebrow || null,
        badge: data.badge || null,
        description: data.description || null,
        policyNote: data.policyNote || null,
        ctaLabel: data.ctaLabel,
        imageUrl: data.imageUrl || null,
        status: data.status,
        displayLocation: data.displayLocation,
        showOnHomepage: data.showOnHomepage,
        popupEnabled: data.popupEnabled,
        triggerType: data.triggerType,
        scrollPercent: data.scrollPercent,
        delaySeconds: data.delaySeconds,
        frequencyHours: data.frequencyHours,
        startDate: toDate(data.startDate),
        endDate: toDate(data.endDate),
        sortOrder: data.sortOrder,
        voucherTemplate: {
          create: {
            discountType: data.voucher.discountType,
            discountValue: decimalOrNull(data.voucher.discountValue),
            codePrefix: data.voucher.codePrefix,
            expiresInDays: data.voucher.expiresInDays,
            usageLimit: data.voucher.usageLimit,
            perCustomerLimit: data.voucher.perCustomerLimit,
            minimumSpend: decimalOrNull(data.voucher.minimumSpend),
          },
        },
        emailTemplate: {
          create: {
            subject: data.email.subject,
            preheader: data.email.preheader || null,
            bodyHtml: data.email.bodyHtml,
            bodyText: data.email.bodyText || null,
            buttonLabel: data.email.buttonLabel || null,
            buttonUrl: data.email.buttonUrl || null,
          },
        },
      },
      include: { voucherTemplate: true, emailTemplate: true, _count: { select: { leads: true, vouchers: true } } },
    });

    await prisma.auditLog.create({
      data: { actor: "admin", action: "PROMOTION_CAMPAIGN_CREATED", entity: `promotionCampaign:${campaign.id}` },
    });

    return Response.json({ success: true, data: campaign }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error("Create promotion campaign error:", error);
    return Response.json({ success: false, error: "Failed to create promotion campaign" }, { status: 500 });
  }
}
