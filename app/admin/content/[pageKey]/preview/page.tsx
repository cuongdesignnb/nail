import { notFound } from "next/navigation";
import Link from "next/link";
import { isValidPageKey, getRegistryItemOrThrow } from "@/lib/content/content-registry";
import { getDraftContent } from "@/lib/content/content.repository";
import type { ContentPageKey } from "@/lib/content/content.types";
import { ArrowLeft, Eye } from "lucide-react";

export default async function ContentPreviewPage({
  params,
}: {
  params: { pageKey: string };
}) {
  if (!isValidPageKey(params.pageKey)) notFound();

  const pageKey = params.pageKey as ContentPageKey;
  const registryItem = getRegistryItemOrThrow(pageKey);
  const draftContent = await getDraftContent(pageKey);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Draft Preview Banner */}
      <div className="sticky top-0 z-50 border-b border-amber-200 bg-amber-50/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-4 py-2.5 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              href={`/admin/content/${pageKey}`}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-amber-200 px-3 py-1.5 text-xs font-bold text-aera-ink hover:bg-amber-50 transition-colors no-underline"
            >
              <ArrowLeft size={14} />
              Back to Editor
            </Link>
            <div className="flex items-center gap-2">
              <Eye size={14} className="text-amber-600" />
              <span className="text-xs font-bold text-amber-700">
                Draft Preview
              </span>
              <span className="text-xs text-amber-600">
                — {registryItem.label}
              </span>
            </div>
          </div>
          <span className="hidden text-[10px] font-bold uppercase tracking-wider text-amber-500 sm:block">
            This preview shows unpublished changes
          </span>
        </div>
      </div>

      {/* Preview Content */}
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-aera-ink">
            {registryItem.label} — Draft Preview
          </h1>
          <p className="mt-1 text-sm text-aera-muted">
            Preview of all draft sections for this page.
          </p>
        </div>

        {/* Render each section's draft content */}
        <div className="space-y-6">
          {registryItem.sections.map((section) => {
            const sectionData = draftContent[section.id];
            const hasContent =
              sectionData !== undefined && sectionData !== null;

            return (
              <div
                key={section.id}
                className="rounded-2xl border border-aera-champagne/30 bg-white p-6 shadow-sm"
              >
                <div className="mb-4 flex items-center gap-3 border-b border-aera-champagne/20 pb-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-aera-champagne to-aera-cream">
                    <span className="text-xs font-bold text-aera-accent">
                      {section.label.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-aera-ink">
                      {section.label}
                    </h2>
                    <p className="text-[11px] text-aera-muted">
                      {section.description}
                    </p>
                  </div>
                  {!hasContent && (
                    <span className="ml-auto rounded-full bg-gray-100 px-2.5 py-1 text-[10px] font-bold text-gray-500">
                      No content
                    </span>
                  )}
                </div>

                {hasContent ? (
                  <pre className="max-h-[400px] overflow-auto rounded-xl bg-gray-50 p-4 text-xs text-aera-ink/80 leading-relaxed">
                    {JSON.stringify(sectionData, null, 2)}
                  </pre>
                ) : (
                  <p className="py-4 text-center text-xs text-aera-muted italic">
                    This section has no draft content yet.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
