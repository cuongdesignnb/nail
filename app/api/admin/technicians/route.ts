import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function GET(req: NextRequest) {
  try { requireAdmin(); } catch (e) {
    const r = authErrorResponse(e); if (r) return r;
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const search = new URL(req.url).searchParams.get("search") || "";
  const where: Record<string, unknown> = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { specialty: { contains: search, mode: "insensitive" } },
    ];
  }

  const technicians = await prisma.technician.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { bookings: true } } },
  });

  const data = technicians.map((t) => ({
    id: t.id,
    name: t.name,
    role: t.role,
    specialty: t.specialty,
    avatar: t.avatar,
    rating: Number(t.rating || 0),
    isActive: t.isActive,
    bookingsCount: t._count.bookings,
  }));

  return NextResponse.json({ success: true, data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  try { requireAdmin(); } catch (e) {
    const r = authErrorResponse(e); if (r) return r;
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const tech = await prisma.technician.create({
      data: {
        name: body.name,
        role: body.role || "Nail Technician",
        specialty: body.specialty || "General",
        avatar: body.avatar || null,
        rating: body.rating || 5,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ success: true, data: tech }, { status: 201 });
  } catch (error) {
    console.error("[technicians] POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create technician" }, { status: 500 });
  }
}
