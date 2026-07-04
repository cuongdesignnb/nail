import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { z } from "zod";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const promotion = await prisma.promotion.findUnique({
      where: { id: params.id },
    });

    if (!promotion) {
      return Response.json({ success: false, error: "Promotion not found" }, { status: 404 });
    }

    return Response.json(
      { success: true, data: { ...promotion, amount: Number(promotion.amount) } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Get promotion error:", error);
    return Response.json({ success: false, error: "Failed to fetch promotion" }, { status: 500 });
  }
}

const updateSchema = z.object({
  code: z.string().min(1).transform((v) => v.toUpperCase().trim()).optional(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed"]).optional(),
  amount: z.number().positive().optional(),
  active: z.boolean().optional(),
  firstBookingOnly: z.boolean().optional(),
  validUntil: z.string().nullable().optional(),
  bannerImage: z.string().nullable().optional(),
  termsHtml: z.string().nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updateData: Record<string, unknown> = { ...data };
    if (data.validUntil !== undefined) {
      updateData.validUntil = data.validUntil ? new Date(data.validUntil) : null;
    }

    const promotion = await prisma.promotion.update({
      where: { id: params.id },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: { actor: "admin", action: "PROMOTION_UPDATED", entity: `promotion:${promotion.id}` },
    });

    return Response.json(
      { success: true, data: { ...promotion, amount: Number(promotion.amount) } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    console.error("Update promotion error:", error);
    return Response.json({ success: false, error: "Failed to update promotion" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    await prisma.promotion.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: { actor: "admin", action: "PROMOTION_DELETED", entity: `promotion:${params.id}` },
    });

    return Response.json(
      { success: true, data: { id: params.id } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Delete promotion error:", error);
    return Response.json({ success: false, error: "Failed to delete promotion" }, { status: 500 });
  }
}
