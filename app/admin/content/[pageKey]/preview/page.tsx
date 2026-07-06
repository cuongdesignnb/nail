import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { ArrowLeft, ArrowRight, Eye, Star } from "lucide-react";

import { RichTextRenderer } from "@/components/admin/editor/RichTextRenderer";
import { authErrorResponse, requireAdmin } from "@/lib/auth/require-admin";
import { isValidPageKey, getRegistryItemOrThrow } from "@/lib/content/content-registry";
import { getDraftContent } from "@/lib/content/content.repository";
import type { ContentPageKey } from "@/lib/content/content.types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

type AnyRecord = Record<string, unknown>;

function isRecord(value: unknown): value is AnyRecord {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function imageFrom(value: unknown) {
  if (!isRecord(value)) return null;
  const src = text(value.src);
  if (!src) return null;
  return { src, alt: text(value.alt, "Aera Nail Lounge") };
}

function buttonFrom(value: unknown) {
  if (!isRecord(value)) return null;
  const label = text(value.label);
  const href = text(value.href);
  if (!label || !href) return null;
  return { label, href };
}

function RichCopy({ value }: { value: unknown }) {
  const html = text(value);
  if (!html) return null;
  return <RichTextRenderer html={html} className="text-sm leading-7 text-[var(--admin-muted)]" />;
}

function PreviewImage({ image }: { image: { src: string; alt: string } | null }) {
  if (!image) return null;
  return (
    <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
      <Image src={image.src} alt={image.alt} fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover" />
    </div>
  );
}

function PreviewButton({ button }: { button: { label: string; href: string } | null }) {
  if (!button) return null;
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-[var(--admin-accent)] px-4 py-2 text-xs font-bold text-white shadow-sm">
      {button.label}
      <ArrowRight size={14} />
    </span>
  );
}

function renderList(items: unknown) {
  if (!Array.isArray(items) || items.length === 0) return null;
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, index) => {
        const row = isRecord(item) ? item : {};
        const image = imageFrom(row.image) || imageFrom(row.avatar);
        return (
          <article key={text(row.id, `item-${index}`)} className="rounded-xl border border-[var(--admin-border)] bg-white p-4 shadow-sm">
            <div className="flex gap-3">
              {image && (
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--admin-surface-muted)]">
                  <Image src={image.src} alt={image.alt} fill sizes="56px" className="object-cover" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--admin-accent)]">
                  {text(row.step) || text(row.role) || text(row.label)}
                </p>
                <h3 className="mt-1 font-heading text-lg font-bold text-[var(--admin-ink)]">
                  {text(row.title) || text(row.name) || text(row.question) || `Item ${index + 1}`}
                </h3>
                {typeof row.rating === "number" && (
                  <div className="mt-1 flex text-[var(--admin-accent)]" aria-label={`${row.rating} star rating`}>
                    {Array.from({ length: Math.max(0, Math.min(5, row.rating)) }).map((_, starIndex) => (
                      <Star key={starIndex} size={13} fill="currentColor" />
                    ))}
                  </div>
                )}
                <div className="mt-2">
                  <RichCopy value={row.description || row.answer || row.quote || row.content} />
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function SectionPreview({ label, data }: { label: string; data: unknown }) {
  if (!isRecord(data)) {
    return (
      <section className="rounded-2xl border border-[var(--admin-border)] bg-white p-6 shadow-sm">
        <h2 className="font-heading text-xl font-bold text-[var(--admin-ink)]">{label}</h2>
        <p className="mt-3 text-sm text-[var(--admin-muted)]">This section has no draft content yet.</p>
      </section>
    );
  }

  const heroImage = imageFrom(data.image) || imageFrom(data.logo) || imageFrom(data.defaultShareImage);
  const primaryButton = buttonFrom(data.primaryButton) || buttonFrom(data.button) || buttonFrom(data.cta);
  const secondaryButton = buttonFrom(data.secondaryButton);
  const items = data.items || data.steps || data.features || data.quickLinks || data.serviceLinks || data.schedule;

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--admin-border)] bg-white shadow-sm">
      <div className="grid gap-6 p-6 md:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--admin-accent)]">
            {text(data.eyebrow, label)}
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-[var(--admin-ink)]">
            {text(data.title) || text(data.name) || label}
            {text(data.highlight) && <span className="text-[var(--admin-accent)]"> {text(data.highlight)}</span>}
          </h2>
          <div className="mt-4 space-y-3">
            <RichCopy value={data.description || data.content || data.brandText || data.tagline} />
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <PreviewButton button={primaryButton} />
            <PreviewButton button={secondaryButton} />
          </div>
          <div className="mt-5 grid gap-2 text-sm text-[var(--admin-muted)] sm:grid-cols-2">
            {["phone", "email", "address", "hours", "googleMapsUrl", "instagramUrl", "facebookUrl", "tiktokUrl"].map((key) => (
              text(data[key]) ? <div key={key}>{text(data[key])}</div> : null
            ))}
          </div>
        </div>
        <PreviewImage image={heroImage} />
      </div>
      {renderList(items) && <div className="border-t border-[var(--admin-border)] bg-[var(--admin-surface-muted)] p-6">{renderList(items)}</div>}
    </section>
  );
}

export default async function ContentPreviewPage({
  params,
}: {
  params: { pageKey: string };
}) {
  noStore();

  try {
    requireAdmin();
  } catch (error) {
    const response = authErrorResponse(error);
    if (response?.status === 401) {
      return (
        <main className="min-h-screen bg-[var(--admin-canvas)] p-8 text-center">
          <p className="text-sm text-[var(--admin-muted)]">Please sign in as an Owner or Manager to preview draft content.</p>
          <Link className="primary-btn mt-4 inline-flex" href="/login">Sign In</Link>
        </main>
      );
    }
    return (
      <main className="min-h-screen bg-[var(--admin-canvas)] p-8 text-center">
        <p className="text-sm text-[var(--admin-muted)]">You do not have permission to preview draft content.</p>
      </main>
    );
  }

  if (!isValidPageKey(params.pageKey)) notFound();

  const pageKey = params.pageKey as ContentPageKey;
  const registryItem = getRegistryItemOrThrow(pageKey);
  const draftContent = await getDraftContent(pageKey);

  return (
    <main className="min-h-screen bg-[var(--admin-canvas)]">
      <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/content/${pageKey}`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-white px-3 py-1.5 text-xs font-bold text-[var(--admin-ink)] no-underline transition-colors hover:bg-amber-50"
            >
              <ArrowLeft size={14} />
              Back to Editor
            </Link>
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-700">Draft Preview</span>
              <span className="text-xs text-amber-600">This preview shows unpublished changes.</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] space-y-6 px-4 py-8 sm:px-6">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[var(--admin-ink)]">{registryItem.label}</h1>
          <p className="mt-1 text-sm text-[var(--admin-muted)]">Saved draft content rendered as a visual page preview.</p>
        </div>

        {registryItem.sections.map((section) => (
          <SectionPreview key={section.id} label={section.label} data={draftContent[section.id]} />
        ))}
      </div>
    </main>
  );
}
