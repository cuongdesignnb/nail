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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const promotion = await prisma.promotionCampaign.findUnique({
      where: { id: params.id },
      include: {
        voucherTemplate: true,
        emailTemplate: true,
        _count: { select: { leads: true, vouchers: true } },
      },
    });
    if (!promotion) return Response.json({ success: false, error: "Promotion not found" }, { status: 404 });
    return Response.json({ success: true, data: promotion }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Get promotion error:", error);
    return Response.json({ success: false, error: "Failed to fetch promotion" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const body = await req.json();
    const data = promotionCampaignSchema.parse(body);
    const promotion = await prisma.promotionCampaign.update({
      where: { id: params.id },
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
          upsert: {
            create: {
              discountType: data.voucher.discountType,
              discountValue: decimalOrNull(data.voucher.discountValue),
              codePrefix: data.voucher.codePrefix,
              expiresInDays: data.voucher.expiresInDays,
              usageLimit: data.voucher.usageLimit,
              perCustomerLimit: data.voucher.perCustomerLimit,
              minimumSpend: decimalOrNull(data.voucher.minimumSpend),
            },
            update: {
              discountType: data.voucher.discountType,
              discountValue: decimalOrNull(data.voucher.discountValue),
              codePrefix: data.voucher.codePrefix,
              expiresInDays: data.voucher.expiresInDays,
              usageLimit: data.voucher.usageLimit,
              perCustomerLimit: data.voucher.perCustomerLimit,
              minimumSpend: decimalOrNull(data.voucher.minimumSpend),
            },
          },
        },
        emailTemplate: {
          upsert: {
            create: {
              subject: data.email.subject,
              preheader: data.email.preheader || null,
              bodyHtml: data.email.bodyHtml,
              bodyText: data.email.bodyText || null,
              buttonLabel: data.email.buttonLabel || null,
              buttonUrl: data.email.buttonUrl || null,
            },
            update: {
              subject: data.email.subject,
              preheader: data.email.preheader || null,
              bodyHtml: data.email.bodyHtml,
              bodyText: data.email.bodyText || null,
              buttonLabel: data.email.buttonLabel || null,
              buttonUrl: data.email.buttonUrl || null,
            },
          },
        },
      },
      include: { voucherTemplate: true, emailTemplate: true, _count: { select: { leads: true, vouchers: true } } },
    });

    await prisma.auditLog.create({
      data: { actor: "admin", action: "PROMOTION_CAMPAIGN_UPDATED", entity: `promotionCampaign:${promotion.id}` },
    });

    return Response.json({ success: true, data: promotion }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    console.error("Update promotion error:", error);
    return Response.json({ success: false, error: "Failed to update promotion" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    await prisma.promotionCampaign.delete({ where: { id: params.id } });
    await prisma.auditLog.create({
      data: { actor: "admin", action: "PROMOTION_CAMPAIGN_DELETED", entity: `promotionCampaign:${params.id}` },
    });
    return Response.json({ success: true, data: { id: params.id } }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Delete promotion error:", error);
    return Response.json({ success: false, error: "Failed to delete promotion" }, { status: 500 });
  }
}
