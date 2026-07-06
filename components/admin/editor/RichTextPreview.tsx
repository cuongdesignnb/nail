'use client';

import { RichTextRenderer } from './RichTextRenderer';

interface RichTextPreviewProps {
  html: string;
  className?: string;
}

export function RichTextPreview({ html, className = '' }: RichTextPreviewProps) {
  return (
    <div
      className={`rounded-xl border border-gray-200 bg-white p-6 ${className}`}
    >
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--admin-muted)]">
        Preview
      </div>
      <div className="border-t border-gray-100 pt-4">
        <RichTextRenderer html={html} className="rich-text-preview" />
      </div>

      <style jsx global>{`
        .rich-text-preview h2 {
          font-family: var(--font-playfair), serif;
          font-size: 1.5rem;
          font-weight: 700;
          margin: 1.25rem 0 0.5rem;
          color: #3D2417;
        }
        .rich-text-preview h3 {
          font-family: var(--font-playfair), serif;
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
          color: #3D2417;
        }
        .rich-text-preview p {
          margin: 0.5rem 0;
          line-height: 1.7;
          color: #3D2417;
        }
        .rich-text-preview ul,
        .rich-text-preview ol {
          padding-left: 1.5rem;
          margin: 0.5rem 0;
        }
        .rich-text-preview ul { list-style: disc; }
        .rich-text-preview ol { list-style: decimal; }
        .rich-text-preview li { margin: 0.25rem 0; color: #3D2417; }
        .rich-text-preview blockquote {
          border-left: 3px solid #A7622A;
          padding-left: 1rem;
          margin: 0.75rem 0;
          color: #74665A;
          font-style: italic;
        }
        .rich-text-preview a {
          color: #A7622A;
          text-decoration: underline;
        }
        .rich-text-preview img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 0.75rem 0;
        }
      `}</style>
    </div>
  );
}
