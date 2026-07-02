import { prisma } from '@/lib/db';

export async function getSeoMetadata(scopeKey: string) {
  return prisma.seoMetadata.findUnique({ where: { scopeKey } });
}
