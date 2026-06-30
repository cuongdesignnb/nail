import { NextResponse } from "next/server";
import { getBookings } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ data: await getBookings() });
}
