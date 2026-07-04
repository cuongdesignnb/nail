import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function GET(req: NextRequest) {
  try { requireAdmin(); } catch (e) {
    const r = authErrorResponse(e); if (r) return r;
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const search = new URL(req.url).searchParams.get("search") || "";
  const where: any = {};
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { sku: { contains: search, mode: "insensitive" } },
      { category: { contains: search, mode: "insensitive" } },
    ];
  }

  const items = await prisma.inventoryItem.findMany({ where, orderBy: { name: "asc" } });
  const data = items.map((item) => ({
    id: item.id,
    name: item.name,
    sku: item.sku,
    category: item.category,
    unit: item.unit,
    currentStock: item.currentStock,
    reorderLevel: item.reorderLevel,
    supplier: item.supplier,
    costPerUnit: Number(item.costPerUnit),
    isActive: item.isActive,
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
    const item = await prisma.inventoryItem.create({
      data: {
        name: body.name,
        sku: body.sku,
        category: body.category || "General",
        unit: body.unit || "pcs",
        currentStock: body.currentStock || 0,
        reorderLevel: body.reorderLevel || 10,
        supplier: body.supplier || null,
        costPerUnit: body.costPerUnit || 0,
      },
    });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch (error) {
    console.error("[inventory] POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create item" }, { status: 500 });
  }
}
