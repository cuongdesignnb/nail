import { getActivePopupCampaign } from "@/lib/promotions/promotion.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getActivePopupCampaign();
    return Response.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Active promotion popup error:", error);
    return Response.json({ success: false, error: "Failed to load promotion popup" }, { status: 500 });
  }
}
