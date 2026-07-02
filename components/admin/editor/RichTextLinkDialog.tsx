'use client';

import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';

interface RichTextLinkDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (url: string, openInNewTab: boolean) => void;
  initialUrl?: string;
  initialNewTab?: boolean;
}

export function RichTextLinkDialog({
  open,
  onClose,
  onSubmit,
  initialUrl = '',
  initialNewTab = true,
}: RichTextLinkDialogProps) {
  const [url, setUrl] = useState(initialUrl);
  const [newTab, setNewTab] = useState(initialNewTab);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setUrl(initialUrl);
      setNewTab(initialNewTab);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialUrl, initialNewTab]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url.trim(), newTab);
  };

  const handleRemoveLink = () => {
    onSubmit('', false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      {/* Dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-gray-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-aera-ink">
            <ExternalLink size={18} className="mr-2 inline text-aera-accent" />
            Insert Link
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
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-aera-ink">
              URL
            </label>
            <input
              ref={inputRef}
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-aera-ink placeholder:text-aera-muted/50 focus:border-aera-accent focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-2 text-sm text-aera-ink">
              <input
                type="checkbox"
                checked={newTab}
                onChange={(e) => setNewTab(e.target.checked)}
                className="rounded border-gray-300 text-aera-accent accent-aera-accent"
              />
              Open in new tab
            </label>
          </div>

          <div className="flex items-center justify-between">
            {initialUrl && (
              <button
                type="button"
                onClick={handleRemoveLink}
                className="text-sm text-red-500 hover:text-red-700"
              >
                Remove link
              </button>
            )}
            <div className="ml-auto flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg px-4 py-2 text-sm text-aera-muted hover:bg-aera-champagne"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-aera-accent px-4 py-2 text-sm font-medium text-white hover:bg-aera-accentHover"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
