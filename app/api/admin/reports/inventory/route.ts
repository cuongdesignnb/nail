import { NextResponse } from "next/server";
import { inventory } from "@/lib/data";

export function GET() {
  return NextResponse.json({ data: inventory });
}
