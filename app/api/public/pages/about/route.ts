import { NextResponse } from "next/server";
import { getPublishedAboutPageContent } from "@/lib/services/about-content.service";

export async function GET() {
  const response = NextResponse.json({ success: true, data: await getPublishedAboutPageContent() });
  response.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
  return response;
}
