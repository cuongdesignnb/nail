'use client';

import { RichTextEditor } from "@/components/admin/editor/RichTextEditor";

interface SectionRichTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  description?: string;
  error?: string;
}

export function SectionRichTextField({
  label,
  value,
  onChange,
  placeholder,
  description,
  error,
}: SectionRichTextFieldProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-neutral-700">
          {label}
        </label>
      </div>

      <RichTextEditor
        value={value || ''}
        onChange={onChange}
        placeholder={placeholder}
      />

      {description && (
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
