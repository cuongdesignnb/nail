import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { z } from "zod";

const patchSchema = z.object({
  approved: z.boolean().optional(),
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
    const data = patchSchema.parse(body);

    const review = await prisma.review.update({
      where: { id: params.id },
      data,
    });

    const actionLabel = data.approved ? "REVIEW_APPROVED" : "REVIEW_HIDDEN";
    await prisma.auditLog.create({
      data: { actor: "admin", action: actionLabel, entity: `review:${review.id}` },
    });

    return Response.json(
      { success: true, data: review },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    console.error("Update review error:", error);
    return Response.json({ success: false, error: "Failed to update review" }, { status: 500 });
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
    await prisma.review.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: { actor: "admin", action: "REVIEW_DELETED", entity: `review:${params.id}` },
    });

    return Response.json(
      { success: true, data: { id: params.id } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Delete review error:", error);
    return Response.json({ success: false, error: "Failed to delete review" }, { status: 500 });
  }
}
