import { NextResponse } from "next/server";
import { getBookings } from "@/lib/store";

export async function GET() {
  const bookings = await getBookings();
  return NextResponse.json({ data: bookings.map((booking) => ({ date: booking.scheduledStartAt.slice(0, 10), revenue: booking.totalAmount })) });
}
