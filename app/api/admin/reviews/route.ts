import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";
import { z } from "zod";

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  status: z.enum(["approved", "pending", "all"]).default("all"),
});

export async function GET(req: NextRequest) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const params = Object.fromEntries(req.nextUrl.searchParams);
    const { page, pageSize, search, rating, status } = querySchema.parse(params);

    const where: Record<string, unknown> = {};
    if (search) where.customer = { contains: search, mode: "insensitive" };
    if (rating) where.rating = rating;
    if (status === "approved") where.approved = true;
    else if (status === "pending") where.approved = false;

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.review.count({ where }),
    ]);

    return Response.json(
      {
        success: true,
        data: { reviews, total, page, pageSize },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Reviews list error:", error);
    return Response.json({ success: false, error: "Failed to fetch reviews" }, { status: 500 });
  }
}

const createSchema = z.object({
  customer: z.string().min(1, "Customer name is required"),
  rating: z.number().int().min(1).max(5),
  text: z.string().min(1, "Review text is required"),
  approved: z.boolean().default(true),
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

    const review = await prisma.review.create({ data });

    await prisma.auditLog.create({
      data: { actor: "admin", action: "REVIEW_CREATED", entity: `review:${review.id}` },
    });

    return Response.json(
      { success: true, data: review },
      { status: 201, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    console.error("Create review error:", error);
    return Response.json({ success: false, error: "Failed to create review" }, { status: 500 });
  }
}
