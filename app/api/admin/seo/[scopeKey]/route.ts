import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { requireAdmin, authErrorResponse } from '@/lib/auth/require-admin';
import { seoMetadataSchema } from '@/lib/validations/seo.schema';

interface RouteParams {
  params: { scopeKey: string };
}

export async function GET(_req: Request, { params }: RouteParams) {
  try {
    requireAdmin();

    const record = await prisma.seoMetadata.findUnique({
      where: { scopeKey: params.scopeKey },
    });

    if (!record) {
      // Return empty default structure
      return NextResponse.json({
        success: true,
        data: {
          scopeKey: params.scopeKey,
          pageKey: params.scopeKey,
          title: '',
          description: '',
          keywords: '',
          canonicalPath: '',
          robots: 'index,follow',
          ogTitle: '',
          ogDescription: '',
          ogImage: '',
          ogImageAlt: '',
          twitterCard: 'summary_large_image',
          schemaJson: null,
        },
      });
    }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;

    console.error('GET admin/seo/[scopeKey] error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}

export async function PUT(req: Request, { params }: RouteParams) {
  try {
    requireAdmin();

    const json = await req.json();
    const body = seoMetadataSchema.parse(json);

    // Parse schemaJson if it's a string
    let schemaJson = body.schemaJson ?? null;
    if (typeof schemaJson === 'string' && schemaJson.trim()) {
      try {
        schemaJson = JSON.parse(schemaJson);
      } catch {
        return NextResponse.json(
          { success: false, message: 'Invalid JSON in schemaJson' },
          { status: 400 },
        );
      }
    }

    const record = await prisma.seoMetadata.upsert({
      where: { scopeKey: params.scopeKey },
      create: {
        scopeKey: params.scopeKey,
        pageKey: json.pageKey || params.scopeKey,
        title: body.title || null,
        description: body.description || null,
        keywords: body.keywords || null,
        canonicalPath: body.canonicalPath || null,
        robots: body.robots || 'index,follow',
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImage: body.ogImage || null,
        ogImageAlt: body.ogImageAlt || null,
        twitterCard: body.twitterCard || 'summary_large_image',
        schemaJson,
      },
      update: {
        title: body.title || null,
        description: body.description || null,
        keywords: body.keywords || null,
        canonicalPath: body.canonicalPath || null,
        robots: body.robots || 'index,follow',
        ogTitle: body.ogTitle || null,
        ogDescription: body.ogDescription || null,
        ogImage: body.ogImage || null,
        ogImageAlt: body.ogImageAlt || null,
        twitterCard: body.twitterCard || 'summary_large_image',
        schemaJson,
      },
    });

    return NextResponse.json({ success: true, data: record });
  } catch (error: any) {
    const authRes = authErrorResponse(error);
    if (authRes) return authRes;

    if (error?.name === 'ZodError') {
      return NextResponse.json(
        { success: false, errors: error.format() },
        { status: 400 },
      );
    }

    console.error('PUT admin/seo/[scopeKey] error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
