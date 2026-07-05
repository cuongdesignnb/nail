import { prisma } from "@/lib/db";
import { normalizeUnicodeText } from "@/lib/utils/text-normalization";

function assertNormalized(label: string, value?: string | null) {
  if (!value) return;
  if (value !== normalizeUnicodeText(value)) {
    throw new Error(`${label} is not NFC-normalized or contains disallowed control characters.`);
  }
}

async function main() {
  const [jobs, posts] = await Promise.all([
    prisma.aiContentJob.findMany({
      select: { id: true, keyword: true, normalizedKeyword: true, errorMessage: true },
      take: 500,
      orderBy: { createdAt: "desc" },
    }),
    prisma.blogPost.findMany({
      where: { aiGenerated: true },
      select: { id: true, title: true, excerpt: true, content: true, seoKeywords: true },
      take: 500,
      orderBy: { createdAt: "desc" },
    }),
  ]);

  for (const job of jobs) {
    assertNormalized(`AiContentJob ${job.id} keyword`, job.keyword);
    assertNormalized(`AiContentJob ${job.id} normalizedKeyword`, job.normalizedKeyword);
    assertNormalized(`AiContentJob ${job.id} errorMessage`, job.errorMessage);
  }
  for (const post of posts) {
    assertNormalized(`BlogPost ${post.id} title`, post.title);
    assertNormalized(`BlogPost ${post.id} excerpt`, post.excerpt);
    assertNormalized(`BlogPost ${post.id} content`, post.content);
    assertNormalized(`BlogPost ${post.id} seoKeywords`, post.seoKeywords);
  }

  console.log(`AI encoding verification passed for ${jobs.length} job(s) and ${posts.length} post(s).`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
