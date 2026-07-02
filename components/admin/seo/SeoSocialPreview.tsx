import { Globe } from 'lucide-react';

interface SeoSocialPreviewProps {
  title: string;
  description: string;
  image: string;
  siteName: string;
}

export function SeoSocialPreview({ title, description, image, siteName }: SeoSocialPreviewProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-aera-muted">
        Social Preview
      </h3>
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {/* Image area */}
        <div className="aspect-[1.91/1] bg-aera-champagne flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt="OG preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-aera-muted/50">
              <Globe size={32} />
              <span className="text-xs">No image set</span>
            </div>
          )}
        </div>
        {/* Content */}
        <div className="border-t border-gray-200 bg-gray-50 p-3">
          <div className="text-xs uppercase text-gray-500">{siteName}</div>
          <div className="mt-1 text-sm font-semibold text-aera-ink line-clamp-1">
            {title || 'Page Title'}
          </div>
          <div className="mt-0.5 text-xs text-gray-500 line-clamp-2">
            {description || 'No description provided'}
          </div>
        </div>
      </div>
    </div>
  );
}
