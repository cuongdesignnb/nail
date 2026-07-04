import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";
import { requireAdmin, authErrorResponse } from "@/lib/auth/require-admin";

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["Owner", "Manager", "Receptionist", "Technician"]).optional(),
  password: z.string().min(6).optional(),
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
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, data: user },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const parsed = updateUserSchema.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    });
    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    if (parsed.name) updateData.name = parsed.name;
    if (parsed.email) updateData.email = parsed.email;
    if (parsed.password) {
      updateData.password = await bcrypt.hash(parsed.password, 12);
    }

    // Track role changes for audit log
    const roleChanged = parsed.role && parsed.role !== existingUser.role;
    if (parsed.role) updateData.role = parsed.role;

    const user = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (roleChanged) {
      await prisma.auditLog.create({
        data: {
          actor: session.email,
          action: "USER_ROLE_UPDATED",
          entity: JSON.stringify({
            userId: params.id,
            previousRole: existingUser.role,
            newRole: parsed.role,
          }),
        },
      });
    }

    return NextResponse.json(
      { success: true, data: user },
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
      { success: false, error: "Failed to update user" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  let session;
  try {
    session = requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    throw error;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Prevent self-deletion
    if (user.email === session.email) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own account" },
        { status: 400 }
      );
    }

    await prisma.user.delete({ where: { id: params.id } });

    await prisma.auditLog.create({
      data: {
        actor: session.email,
        action: "USER_DELETED",
        entity: JSON.stringify({
          userId: params.id,
          email: user.email,
          role: user.role,
        }),
      },
    });

    return NextResponse.json(
      { success: true, data: { id: params.id } },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
