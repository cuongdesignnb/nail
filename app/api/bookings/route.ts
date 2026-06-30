import { NextResponse } from "next/server";
import { getBookings } from "@/lib/store";
import { bookingSchema, buildBooking } from "@/lib/booking";
import { createBooking } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const bookings = await getBookings();
  return NextResponse.json({ data: code ? bookings.find((booking) => booking.bookingCode === code) : bookings });
}

export async function POST(request: Request) {
  const input = bookingSchema.parse(await request.json());
  const booking = await buildBooking(input);
  await createBooking(booking);
  return NextResponse.json({ data: booking }, { status: 201 });
}
