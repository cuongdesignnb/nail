import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { z } from "zod";

export async function GET() {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const promotions = await prisma.promotion.findMany({
      orderBy: { createdAt: "desc" },
    });

    const data = promotions.map((p) => ({
      ...p,
      amount: Number(p.amount),
    }));

    return Response.json(
      { success: true, data },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Promotions list error:", error);
    return Response.json({ success: false, error: "Failed to fetch promotions" }, { status: 500 });
  }
}

const createSchema = z.object({
  code: z.string().min(1, "Promo code is required").transform((v) => v.toUpperCase().trim()),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["percentage", "fixed"]),
  amount: z.number().positive("Amount must be positive"),
  active: z.boolean().default(true),
  firstBookingOnly: z.boolean().default(false),
  validUntil: z.string().nullable().optional(),
  bannerImage: z.string().optional(),
  termsHtml: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const body = await req.json();
    const data = createSchema.parse(body);

    const promotion = await prisma.promotion.create({
      data: {
        ...data,
        validUntil: data.validUntil ? new Date(data.validUntil) : null,
      },
    });

    await prisma.auditLog.create({
      data: { actor: "admin", action: "PROMOTION_CREATED", entity: `promotion:${promotion.id}` },
    });

    return Response.json(
      { success: true, data: { ...promotion, amount: Number(promotion.amount) } },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0].message }, { status: 400 });
    }
    console.error("Create promotion error:", error);
    return Response.json({ success: false, error: "Failed to create promotion" }, { status: 500 });
  }
}
