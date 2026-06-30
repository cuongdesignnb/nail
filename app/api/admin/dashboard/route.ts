import { NextResponse } from "next/server";
import { dashboardMetrics } from "@/lib/admin";
import { getBookings } from "@/lib/store";

export async function GET() {
  return NextResponse.json({ data: dashboardMetrics(await getBookings()) });
}
