import { NextResponse } from "next/server";
import { reviews } from "@/lib/data";

export function GET() {
  return NextResponse.json({ data: reviews.filter((review) => review.approved) });
}

export async function POST() {
  return NextResponse.json({ data: { ok: true, message: "Review submitted for approval." } }, { status: 201 });
}
