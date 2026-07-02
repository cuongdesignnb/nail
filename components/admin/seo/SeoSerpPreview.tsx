interface SeoSerpPreviewProps {
  title: string;
  url: string;
  description: string;
}

export function SeoSerpPreview({ title, url, description }: SeoSerpPreviewProps) {
  const truncatedTitle = title.length > 60 ? title.slice(0, 57) + '...' : title;
  const truncatedDesc = description.length > 160 ? description.slice(0, 157) + '...' : description;

  // Format URL for display (remove protocol)
  const displayUrl = url.replace(/^https?:\/\//, '');

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-aera-muted">
        Google Preview
      </h3>
      <div className="rounded-lg border border-gray-100 bg-white p-4">
        {/* Title link */}
        <div
          className="mb-1 text-xl leading-snug"
          style={{ color: '#1a0dab', fontFamily: 'Arial, sans-serif' }}
        >
          {truncatedTitle || 'Page Title'}
        </div>
        {/* URL */}
        <div
          className="mb-1 text-sm"
          style={{ color: '#006621', fontFamily: 'Arial, sans-serif' }}
        >
          {displayUrl || 'example.com'}
        </div>
        {/* Description */}
        <div
          className="text-sm leading-relaxed"
          style={{ color: '#545454', fontFamily: 'Arial, sans-serif' }}
        >
          {truncatedDesc || 'No description provided'}
        </div>
      </div>
    </div>
  );
}
