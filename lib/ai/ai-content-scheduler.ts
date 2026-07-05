import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export async function publishDueScheduledBlogPosts() {
  const due = await prisma.blogPost.findMany({
    where: { status: "SCHEDULED", scheduledAt: { lte: new Date() } },
    take: 25,
    orderBy: { scheduledAt: "asc" },
  });

  const published = [];
  for (const post of due) {
    if (!post.content) continue;
    const updated = await prisma.blogPost.update({
      where: { id: post.id },
      data: { status: "PUBLISHED", publishedAt: new Date() },
    });
    await prisma.auditLog.create({
      data: {
        actor: "cron",
        action: "AI_SCHEDULED_POST_PUBLISHED",
        entity: `BlogPost:${post.id}`,
        entityType: "BlogPost",
        entityId: post.id,
      },
    }).catch(() => undefined);
    published.push(updated);
    revalidatePath("/blog");
    revalidatePath(`/blog/${updated.slug}`);
    revalidatePath("/sitemap.xml");
  }
  return published;
}
