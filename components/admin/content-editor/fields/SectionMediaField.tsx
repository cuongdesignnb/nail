'use client';

import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

interface SectionMediaFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  altValue?: string;
  onAltChange?: (alt: string) => void;
  description?: string;
  aspectRatio?: string;
  error?: string;
  altError?: string;
}

export function SectionMediaField({
  label,
  value,
  onChange,
  altValue = '',
  onAltChange,
  description,
  aspectRatio = '16/10',
  error,
  altError,
}: SectionMediaFieldProps) {
  return (
    <div className="space-y-3 p-4 rounded-lg border border-neutral-100 bg-neutral-50/50">
      <MediaPickerField
        valueMode="url"
        label={label}
        value={value || ''}
        alt={altValue}
        onChange={(url) => onChange(url || "")}
        onAltChange={onAltChange}
        aspectRatio={aspectRatio}
      />

      {onAltChange && (
        <div className="space-y-1">
          <label className="text-xs font-medium text-neutral-600">
            Image Alt Text (SEO & Accessibility)
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-sm outline-none transition-colors focus:border-[var(--admin-accent)]"
            placeholder="Describe this image for screen readers..."
            value={altValue}
            onChange={(e) => onAltChange(e.target.value)}
          />
          {altError && (
            <p className="text-xs text-red-500 font-medium">
              {altError}
            </p>
          )}
        </div>
      )}

      {description && !onAltChange && (
        <p className="text-xs text-neutral-500">
          {description}
        </p>
      )}

      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
