// ---------------------------------------------------------------------------
// Admin dashboard API route
// ---------------------------------------------------------------------------

import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, authErrorResponse } from '@/lib/auth/require-admin';
import { getDashboardOverview } from '@/lib/dashboard/dashboard.service';
import { dateRangeQuerySchema } from '@/lib/dashboard/dashboard.range';

export async function GET(request: NextRequest) {
  // ── Auth ──────────────────────────────────────────────────
  try {
    requireAdmin();
  } catch (error) {
    const res = authErrorResponse(error);
    if (res) return res;
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Data ──────────────────────────────────────────────────
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams);
    const { range, from, to } = dateRangeQuerySchema.parse(params);
    const data = await getDashboardOverview(range, from, to);

    return NextResponse.json(
      { success: true, data },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (error) {
    console.error('[dashboard] Failed to load overview:', error);
    return NextResponse.json(
      {
        error: 'Failed to load dashboard',
        message:
          process.env.NODE_ENV === 'development' && error instanceof Error
            ? error.message
            : undefined,
      },
      { status: 500 },
    );
  }
}
