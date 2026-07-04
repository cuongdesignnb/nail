import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

export async function GET() {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const items = await prisma.inventoryItem.findMany({
      where: { isActive: true },
      select: {
        id: true,
        name: true,
        sku: true,
        category: true,
        unit: true,
        currentStock: true,
        reorderLevel: true,
        costPerUnit: true,
        movements: {
          take: 5,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            type: true,
            quantity: true,
            previousStock: true,
            newStock: true,
            reason: true,
            createdAt: true,
          },
        },
      },
      orderBy: { name: "asc" },
    });

    const allItems = items.map((item) => ({
      ...item,
      costPerUnit: Number(item.costPerUnit),
      isLowStock: item.currentStock <= item.reorderLevel,
    }));

    const lowStockItems = allItems.filter((item) => item.isLowStock);

    return Response.json(
      {
        success: true,
        data: {
          items: allItems,
          lowStockItems,
          totalItems: allItems.length,
          lowStockCount: lowStockItems.length,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Inventory report error:", error);
    return Response.json({ success: false, error: "Failed to generate inventory report" }, { status: 500 });
  }
}
