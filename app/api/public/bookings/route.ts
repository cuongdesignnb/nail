import { NextResponse } from "next/server";
import { bookingSchema, buildBooking } from "@/lib/booking";
import { createBooking } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = bookingSchema.parse(body);
    const booking = await buildBooking(input);
    await createBooking(booking);
    return NextResponse.json({ data: booking }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Booking failed" }, { status: 400 });
  }
}
