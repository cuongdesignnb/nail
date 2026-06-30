import { NextResponse } from "next/server";
import { getBookings, saveBookings } from "@/lib/store";
import { bookingSchema, buildBooking } from "@/lib/booking";

export async function GET() {
  return NextResponse.json({ data: await getBookings() });
}

export async function POST(request: Request) {
  const input = bookingSchema.parse(await request.json());
  const booking = await buildBooking(input);
  const bookings = await getBookings();
  bookings.unshift(booking);
  await saveBookings(bookings);
  return NextResponse.json({ data: booking }, { status: 201 });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const bookings = await getBookings();
  const next = bookings.map((booking) => booking.id === body.id ? { ...booking, ...body, updatedAt: new Date().toISOString() } : booking);
  await saveBookings(next);
  return NextResponse.json({ data: next.find((booking) => booking.id === body.id) });
}
