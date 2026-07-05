"use client";

import { Eye, Save, Send } from "lucide-react";

export function MenuMobileActionBar({
  saving,
  canSave,
  canPublish,
  onPreview,
  onSave,
  onPublish,
}: {
  saving: boolean;
  canSave: boolean;
  canPublish: boolean;
  onPreview: () => void;
  onSave: () => void;
  onPublish: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-aera-champagne/50 bg-white/95 p-3 shadow-2xl backdrop-blur lg:hidden">
      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={onPreview} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-3 text-xs font-bold uppercase tracking-wider text-aera-ink">
          <Eye className="h-4 w-4" />
          Preview
        </button>
        <button type="button" disabled={saving || !canSave} onClick={onSave} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-aera-ink px-4 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">
          <Save className="h-4 w-4" />
          Save Draft
        </button>
        <button type="button" disabled={saving || !canPublish} onClick={onPublish} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-aera-accent px-4 text-xs font-bold uppercase tracking-wider text-white disabled:opacity-50">
          <Send className="h-4 w-4" />
          Publish
        </button>
      </div>
    </div>
  );
}
