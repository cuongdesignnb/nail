import { NextResponse } from "next/server";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(3)
});

export async function POST(request: Request) {
  const body = await request.json();
  const result = contactSchema.safeParse(body);
  if (!result.success) return NextResponse.json({ error: "Invalid contact request" }, { status: 400 });
  return NextResponse.json({ data: { ok: true, message: "Your message has been received." } });
}
