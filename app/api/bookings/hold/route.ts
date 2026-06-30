import { NextResponse } from "next/server";
import { canBook } from "@/lib/booking";

export async function POST(request: Request) {
  const body = await request.json();
  const start = new Date(`${body.date}T${body.time}:00`);
  const end = new Date(start.getTime() + Number(body.duration ?? 60) * 60_000);
  const available = await canBook(body.technicianId, start, end);
  return NextResponse.json({ data: { holdId: available ? crypto.randomUUID() : null, available, expiresInSeconds: 600 } }, { status: available ? 200 : 409 });
}
