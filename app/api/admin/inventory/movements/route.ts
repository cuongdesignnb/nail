import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

const createMovementSchema = z.object({
  inventoryItemId: z.string().min(1, "Inventory item ID is required"),
  type: z.enum(["adjustment", "purchase", "usage", "return"]),
  quantity: z.number().int("Quantity must be an integer"),
  reason: z.string().optional(),
});

export async function POST(request: Request) {
  let session;
  try {
    session = requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const body = await request.json();
    const parsed = createMovementSchema.parse(body);

    const item = await prisma.inventoryItem.findUnique({
      where: { id: parsed.inventoryItemId },
    });

    if (!item) {
      return NextResponse.json(
        { success: false, error: "Inventory item not found" },
        { status: 404 }
      );
    }

    const previousStock = item.currentStock;
    const newStock = previousStock + parsed.quantity;

    // Use transaction to ensure atomicity
    const [movement] = await prisma.$transaction([
      prisma.inventoryMovement.create({
        data: {
          inventoryItemId: parsed.inventoryItemId,
          type: parsed.type,
          quantity: parsed.quantity,
          previousStock,
          newStock,
          reason: parsed.reason || null,
          performedBy: session.email,
        },
      }),
      prisma.inventoryItem.update({
        where: { id: parsed.inventoryItemId },
        data: { currentStock: newStock },
      }),
      prisma.auditLog.create({
        data: {
          actor: session.email,
          action: "INVENTORY_ADJUSTED",
          entity: JSON.stringify({
            itemId: parsed.inventoryItemId,
            itemName: item.name,
            type: parsed.type,
            quantity: parsed.quantity,
            previousStock,
            newStock,
            reason: parsed.reason,
          }),
        },
      }),
    ]);

    return NextResponse.json(
      { success: true, data: movement },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.issues[0]?.message || "Validation error" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to create inventory movement" },
      { status: 500 }
    );
  }
}
