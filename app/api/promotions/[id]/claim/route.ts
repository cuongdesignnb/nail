import { NextRequest } from "next/server";
import { z } from "zod";
import { promotionClaimRateLimit } from "@/lib/promotions/promotion-rate-limit";
import { claimPromotionVoucher } from "@/lib/promotions/promotion.service";
import { promotionClaimSchema } from "@/lib/promotions/promotion.validation";

function clientIp(req: NextRequest) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const json = await req.json();
    const input = promotionClaimSchema.parse(json);
    const ip = clientIp(req);
    const rateKey = `${params.id}:${input.email}:${ip}`;
    if (!promotionClaimRateLimit(rateKey)) {
      return Response.json({ success: false, error: "Please wait before requesting another voucher." }, { status: 429 });
    }

    const result = await claimPromotionVoucher(input, {
      campaignId: params.id,
      ip,
      userAgent: req.headers.get("user-agent") || undefined,
    });
    if (!result.ok) {
      return Response.json({ success: false, error: result.error }, { status: result.status });
    }
    return Response.json({ success: true, message: result.message }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0]?.message || "Please check your information." }, { status: 400 });
    }
    console.error("Promotion claim error:", error);
    return Response.json({ success: false, error: "We couldn't send your voucher right now. Please try again." }, { status: 500 });
  }
}
