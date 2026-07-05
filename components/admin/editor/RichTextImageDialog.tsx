'use client';

import { useState, useEffect } from 'react';
import { X, ImageIcon } from 'lucide-react';
import { MediaPickerField } from '@/components/admin/media/MediaPickerField';

interface RichTextImageDialogProps {
  open: boolean;
  onClose: () => void;
  onInsert: (src: string, alt: string) => void;
}

export function RichTextImageDialog({
  open,
  onClose,
  onInsert,
}: RichTextImageDialogProps) {
  const [src, setSrc] = useState('');
  const [alt, setAlt] = useState('');

  useEffect(() => {
    if (open) {
      setSrc('');
      setAlt('');
    }
  }, [open]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (src.trim()) {
      onInsert(src.trim(), alt.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-aera-ink">
            <ImageIcon size={18} className="mr-2 inline text-aera-accent" />
            Insert Image
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-aera-muted hover:bg-aera-champagne"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <MediaPickerField
              label="Image"
              value={src}
              alt={alt}
              onChange={(url) => setSrc(url)}
              onAltChange={(nextAlt) => setAlt(nextAlt)}
              folder="rich-text"
            />
            <p className="mt-1 text-xs text-aera-muted">
              Alt text helps with accessibility and SEO
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg px-4 py-2 text-sm text-aera-muted hover:bg-aera-champagne"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!src.trim()}
              className="rounded-lg bg-aera-accent px-4 py-2 text-sm font-medium text-white hover:bg-aera-accentHover disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Insert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
