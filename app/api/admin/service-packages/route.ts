import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { packageSchema } from "@/lib/validations/services.validation";

// TODO: Replace with real admin auth check
async function requireAdmin() {
  return true;
}

export async function GET() {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const packages = await prisma.servicePackage.findMany({
      orderBy: { sortOrder: "asc" },
    });

    return NextResponse.json({ success: true, data: packages });
  } catch (error) {
    console.error("GET Packages Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAdmin = await requireAdmin();
    if (!isAdmin) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const result = packageSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: "Validation failed", errors: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const pkg = await prisma.servicePackage.create({
      data: result.data,
    });

    return NextResponse.json({ success: true, data: pkg });
  } catch (error) {
    console.error("POST Packages Error:", error);
    return NextResponse.json({ success: false, message: "Internal server error" }, { status: 500 });
  }
}
