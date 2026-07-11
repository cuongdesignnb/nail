import { NextResponse } from "next/server";
import { fetchGalleryPageContent } from "@/services/gallery-page.service";

export async function GET() {
  return NextResponse.json({ data: await fetchGalleryPageContent() }, { headers: { "Cache-Control": "no-store" } });
}
