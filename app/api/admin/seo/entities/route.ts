import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireRole, roleErrorResponse } from "@/lib/auth/require-role";
import { authErrorResponse } from "@/lib/auth/require-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    requireRole(["Owner", "Manager"]);
    const [records, posts, services, packages] = await Promise.all([
      prisma.seoMetadata.findMany({
        where: {
          NOT: {
            scopeKey: { in: ["home", "about", "services", "gallery", "packages", "promotions", "contact", "blog"] },
          },
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.blogPost.findMany({
        where: { status: "PUBLISHED" },
        select: { id: true, title: true, slug: true, updatedAt: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.service.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, updatedAt: true },
        orderBy: { sortOrder: "asc" },
      }),
      prisma.nailPackage.findMany({
        where: { isActive: true },
        select: { id: true, name: true, slug: true, updatedAt: true },
        orderBy: { sortOrder: "asc" },
      }).catch(() => []),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        records,
        entities: [
          ...posts.map((post) => ({ scopeKey: `blog:${post.id}`, type: "Blog Article", label: post.title, path: `/blog/${post.slug}` })),
          ...services.map((service) => ({ scopeKey: `service:${service.id}`, type: "Service", label: service.name, path: `/services/${service.slug}` })),
          ...packages.map((pkg) => ({ scopeKey: `package:${pkg.id}`, type: "Package", label: pkg.name, path: `/packages` })),
        ],
      },
    });
  } catch (error) {
    const auth = authErrorResponse(error) || roleErrorResponse(error);
    if (auth) return auth;
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

