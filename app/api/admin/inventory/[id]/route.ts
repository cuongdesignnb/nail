import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

const updateInventorySchema = z.object({
  name: z.string().min(1).optional(),
  sku: z.string().optional(),
  category: z.string().optional(),
  unit: z.string().optional(),
  reorderLevel: z.number().int().min(0).optional(),
  supplier: z.string().optional(),
  costPerUnit: z.number().min(0).optional(),
  isActive: z.boolean().optional(),
});

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const item = await prisma.inventoryItem.findUnique({
      where: { id: params.id },
      include: {
        movements: {
          orderBy: { createdAt: "desc" },
          take: 50,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: item },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch inventory item" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const body = await request.json();
    const parsed = updateInventorySchema.parse(body);

    const item = await prisma.inventoryItem.update({
      where: { id: params.id },
      data: parsed,
    });

    return NextResponse.json(
      { success: true, data: item },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to update inventory item" },
      { status: 500 }
    );
  }
}
