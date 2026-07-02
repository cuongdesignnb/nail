import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth/require-admin';

export async function GET() {
  try {
    requireAdmin();

    const records = await prisma.seoMetadata.findMany({
      orderBy: { pageKey: 'asc' },
    });

    return NextResponse.json({ success: true, data: records });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;

    console.error('GET admin/seo error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
