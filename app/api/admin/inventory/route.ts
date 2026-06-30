import { NextResponse } from "next/server";
import { inventory } from "@/lib/data";

export function GET() {
  return NextResponse.json({ data: inventory });
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ data: { ...body, id: crypto.randomUUID(), created: true } }, { status: 201 });
}
