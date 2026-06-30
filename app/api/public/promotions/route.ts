import { NextResponse } from "next/server";
import { promotions } from "@/lib/data";

export function GET() {
  return NextResponse.json({ data: promotions.filter((promotion) => promotion.active) });
}
