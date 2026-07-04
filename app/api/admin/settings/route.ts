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
    let settings = await prisma.businessSetting.findFirst({
      where: { key: "default" },
    });

    if (!settings) {
      settings = await prisma.businessSetting.create({
        data: { key: "default" },
      });
    }

    return Response.json(
      { success: true, data: settings },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Settings GET error:", error);
    return Response.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

const updateSchema = z.object({
  timezone: z.string().optional(),
  currency: z.string().optional(),
});

export async function PUT(req: NextRequest) {
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const settings = await prisma.businessSetting.upsert({
      where: { key: "default" },
      create: { key: "default", ...data },
      update: data,
    });

    return Response.json(
      { success: true, data: settings },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ success: false, error: error.issues[0]?.message || "Validation error" }, { status: 400 });
    }
    console.error("Settings PUT error:", error);
    return Response.json({ success: false, error: "Failed to update settings" }, { status: 500 });
  }
}
