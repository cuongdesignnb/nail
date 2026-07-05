import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      status: "ok",
      service: "aera-nail-lounge",
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        status: "unavailable",
        service: "aera-nail-lounge",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
