import { NextResponse } from "next/server";
import { getBookings } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const bookings = await getBookings();
  return NextResponse.json({ data: code ? bookings.find((booking) => booking.bookingCode === code) : bookings });
}

export async function POST(request: Request) {
  await request.body?.cancel().catch(() => undefined);
  return NextResponse.json({ success: false, error: "This legacy endpoint is retired. Use /api/public/bookings; payment is collected at the salon." }, { status: 410 });
}
