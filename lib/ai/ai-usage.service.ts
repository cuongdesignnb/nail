import { prisma } from "@/lib/db";

export async function getAiUsageSummary() {
  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);

  const [jobsThisMonth, completed, failed, manualReview, imageAgg, settings] = await Promise.all([
    prisma.aiContentJob.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.aiContentJob.count({ where: { createdAt: { gte: monthStart }, status: "completed" } }),
    prisma.aiContentJob.count({ where: { createdAt: { gte: monthStart }, status: "failed" } }),
    prisma.aiContentJob.count({ where: { createdAt: { gte: monthStart }, status: "manual_review" } }),
    prisma.aiContentJob.aggregate({ where: { createdAt: { gte: monthStart } }, _sum: { imageCount: true } }),
    prisma.aiProviderSetting.findUnique({ where: { provider: "openai" } }),
  ]);

  return {
    jobsThisMonth,
    articlesGenerated: completed,
    failedJobs: failed,
    manualReviewJobs: manualReview,
    imagesGenerated: imageAgg._sum.imageCount || 0,
    monthlyBudgetUsed: settings ? Number(settings.monthlyBudgetUsed) : 0,
    monthlyBudgetLimit: settings?.monthlyBudgetLimit ? Number(settings.monthlyBudgetLimit) : null,
  };
}
