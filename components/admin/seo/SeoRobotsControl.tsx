interface SeoRobotsControlProps {
  value: string;
  onChange: (value: string) => void;
}

const robotsOptions = [
  { value: 'index,follow', label: 'Index, Follow (default)' },
  { value: 'noindex,follow', label: 'No Index, Follow' },
  { value: 'index,nofollow', label: 'Index, No Follow' },
  { value: 'noindex,nofollow', label: 'No Index, No Follow' },
];

export function SeoRobotsControl({ value, onChange }: SeoRobotsControlProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-aera-ink">
        Robots Directive
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-aera-ink focus:border-aera-accent focus:outline-none"
      >
        {robotsOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <p className="mt-1 text-xs text-aera-muted">
        Controls whether search engines index and follow links on this page
      </p>
    </div>
  );
}
