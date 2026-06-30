import { NextResponse } from "next/server";
import { getQualifiedTechnicians, getTimeSlots, servicesDuration } from "@/lib/availability";
import { getBookings } from "@/lib/store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const serviceIds = searchParams.get("services")?.split(",").filter(Boolean) ?? [];
  const technicianId = searchParams.get("technicianId") ?? "no-preference";
  const date = searchParams.get("date") ?? new Date().toISOString().slice(0, 10);
  const duration = Number(searchParams.get("duration")) || servicesDuration(serviceIds) || 60;
  const bookings = await getBookings();
  const qualified = getQualifiedTechnicians(serviceIds);
  const selected = technicianId === "no-preference" ? qualified[0]?.id : technicianId;
  const slots = selected ? getTimeSlots(date, selected, duration, bookings) : [];
  return NextResponse.json({ data: { technicians: qualified, slots, date, duration } });
}
