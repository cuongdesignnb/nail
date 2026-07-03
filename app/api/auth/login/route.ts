import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { signAdminSession } from "@/lib/auth/require-admin";
import { prisma } from "@/lib/db";

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

  // Look up user name from DB
  const user = await prisma.user.findUnique({ where: { email }, select: { name: true, role: true } });
  const role = (user?.role as "Owner" | "Manager") || "Owner";
  const displayName = user?.name?.split(" ")[0] || "Admin";

  const token = signAdminSession({ email, role });
  const secureCookie = (process.env.NEXTAUTH_URL || "").startsWith("https://");
  cookies().set("aera_admin_session", token, {
    httpOnly: true,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });
  // Non-httpOnly cookie so client JS can read admin name for greeting
  cookies().set("adminName", displayName, {
    httpOnly: false,
    secure: secureCookie,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ success: true });
}
