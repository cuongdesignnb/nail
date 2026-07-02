import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { packageRewardSchema } from "@/lib/validations/packages.validation";

export async function GET() {
  try {
    const list = await prisma.packageReward.findMany({
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json({ success: true, data: list });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const body = packageRewardSchema.parse(json);
    const item = await prisma.packageReward.create({ data: body });
    return NextResponse.json({ success: true, data: item });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
