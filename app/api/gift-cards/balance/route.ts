export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { z } from "zod";
import { checkGiftCardBalance } from "@/lib/gift-cards/gift-card.service";
import { balanceCheckSchema } from "@/lib/gift-cards/gift-card-validation";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const url = new URL(req.url);
  return handle(req, {
    code: url.searchParams.get("code") || "",
    recipientEmail: url.searchParams.get("recipientEmail") || "",
  });
}

export async function POST(req: Request) {
  return handle(req, await req.json());
}

async function handle(req: Request, body: unknown) {
  try {
    const limit = rateLimit(getRateLimitKey(req, "gift-card-balance"), 8, 60_000);
    if (!limit.ok) return Response.json({ success: false, error: "Too many balance checks. Please try again shortly." }, { status: 429 });
    const input = balanceCheckSchema.parse(body);
    const data = await checkGiftCardBalance(input);
    return Response.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ success: false, error: "Validation failed" }, { status: 400 });
    return Response.json({ success: false, error: error instanceof Error ? error.message : "Unable to check Gift Card balance." }, { status: 400 });
  }
}
