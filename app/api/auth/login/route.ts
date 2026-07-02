import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signAdminSession } from "@/lib/auth/require-admin";

export async function POST(request: Request) {
  const body = await request.json();
  const email = String(body.email ?? "");
  const password = String(body.password ?? "");
  const adminEmail = process.env.ADMIN_EMAIL || "admin@aeranailounge.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "AeraAdmin123!";

  const passwordMatches = adminPassword.startsWith("$2")
    ? await bcrypt.compare(password, adminPassword)
    : password === adminPassword;

  if (email !== adminEmail || !passwordMatches) {
    return NextResponse.json({ success: false, error: "Invalid email or password" }, { status: 401 });
  }

  const token = signAdminSession({ email, role: "Owner" });
  const secureCookie = (process.env.NEXTAUTH_URL || "").startsWith("https://");
  cookies().set("aera_admin_session", token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ success: true });
}
