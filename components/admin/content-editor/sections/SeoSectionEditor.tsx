'use client';

import { SeoEditorPanel } from '@/components/admin/seo/SeoEditorPanel';
import type { SeoFields } from '@/lib/content/content.types';

type Props = {
  data: SeoFields;
  onChange: (updated: SeoFields) => void;
  scopeKey: string;
  pageKey: string;
};

export function SeoSectionEditor({ data, onChange, scopeKey, pageKey }: Props) {
  const seoData = {
    title: data.title ?? '',
    description: data.description ?? '',
    keywords: data.keywords?.join(', ') ?? '',
    canonicalPath: data.canonicalUrl ?? '',
    robots: data.robotsDirective ?? 'index,follow',
    ogTitle: data.ogTitle ?? '',
    ogDescription: data.ogDescription ?? '',
    ogImage: data.ogImage?.src ?? '',
    ogImageAlt: data.ogImage?.alt ?? '',
    twitterCard: data.twitterCard ?? 'summary_large_image',
    schemaJson: data.structuredData ? JSON.stringify(data.structuredData, null, 2) : '',
  };

  async function handleSave(saved: {
    title?: string;
    description?: string;
    keywords?: string;
    canonicalPath?: string;
    robots?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    ogImageAlt?: string;
    twitterCard?: string;
    schemaJson?: string;
  }) {
    const keywordsArr = saved.keywords
      ? saved.keywords.split(',').map((k) => k.trim()).filter(Boolean)
      : [];

    let structuredData: Record<string, unknown> | undefined;
    if (saved.schemaJson) {
      try { structuredData = JSON.parse(saved.schemaJson); } catch { /* ignore */ }
    }

    onChange({
      ...data,
      title: saved.title ?? data.title,
      description: saved.description ?? data.description,
      keywords: keywordsArr,
      canonicalUrl: saved.canonicalPath ?? data.canonicalUrl,
      robotsDirective: saved.robots ?? data.robotsDirective,
      ogTitle: saved.ogTitle ?? data.ogTitle,
      ogDescription: saved.ogDescription ?? data.ogDescription,
      ogImage: { src: saved.ogImage ?? '', alt: saved.ogImageAlt ?? '' },
      twitterCard: saved.twitterCard ?? data.twitterCard,
      structuredData,
    });
  }

  return (
    <SeoEditorPanel
      scopeKey={scopeKey}
      pageKey={pageKey}
      initialData={seoData}
      onSave={handleSave}
    />
  );
}
