import { listActiveHomepageCampaigns } from "@/lib/promotions/promotion.service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await listActiveHomepageCampaigns();
    return Response.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Active promotions error:", error);
    return Response.json({ success: false, error: "Failed to load promotions" }, { status: 500 });
  }
}
