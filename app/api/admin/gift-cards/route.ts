export const dynamic = "force-dynamic";

import { listAdminGiftCards } from "@/lib/gift-cards/gift-card.service";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const data = await listAdminGiftCards({
    search: url.searchParams.get("search") || undefined,
    type: url.searchParams.get("type") || undefined,
    status: url.searchParams.get("status") || undefined,
    emailStatus: url.searchParams.get("emailStatus") || undefined,
  });
  return Response.json({ success: true, data });
}
