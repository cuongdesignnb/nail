import { NextResponse } from "next/server";
import { technicians } from "@/lib/data";

export function GET() {
  return NextResponse.json({ data: technicians });
}
