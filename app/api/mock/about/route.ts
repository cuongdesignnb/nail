import { NextResponse } from "next/server";
import { defaultAboutContent } from "@/data/about.default";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: defaultAboutContent,
  });
}
