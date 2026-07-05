import { getPublicPayPalConfig } from "@/lib/payments/paypal/paypal.config";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const limit = rateLimit(getRateLimitKey(req, "paypal-config"), 60, 60_000);
  if (!limit.ok) return Response.json({ success: false, error: "Too many requests" }, { status: 429 });
  const config = await getPublicPayPalConfig();
  return Response.json({ success: true, data: config }, { headers: { "Cache-Control": "no-store" } });
}
