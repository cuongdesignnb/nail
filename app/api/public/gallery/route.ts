import { NextResponse } from "next/server";
import { gallery } from "@/lib/data";

export function GET() {
  return NextResponse.json({ data: gallery });
}
