import { NextResponse } from "next/server";
import { services } from "@/lib/data";

export function GET(_: Request, { params }: { params: { slug: string } }) {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
  return NextResponse.json({ data: service });
}
