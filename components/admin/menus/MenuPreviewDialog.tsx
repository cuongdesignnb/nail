"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import type { NavigationLocation, NavigationMenuItem } from "@/lib/navigation/navigation.types";
import { MenuPreviewPanel } from "./MenuPreviewPanel";

type MenuPreviewDialogProps = {
  open: boolean;
  location: NavigationLocation;
  items: NavigationMenuItem[];
  onClose: () => void;
};

export function MenuPreviewDialog({ open, location, items, onClose }: MenuPreviewDialogProps) {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", onKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-5">
      <button type="button" aria-label="Close preview" className="absolute inset-0 bg-aera-ink/35 backdrop-blur-sm" onClick={onClose} />
      <div role="dialog" aria-modal="true" aria-label="Draft menu preview" className="relative flex h-[min(820px,90vh)] w-[min(1320px,96vw)] flex-col overflow-hidden rounded-[24px] border border-aera-champagne/50 bg-[#fffaf4] shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-aera-champagne/50 bg-white px-5 py-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-heading text-2xl text-aera-ink">Preview Draft</h2>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-700">Draft Preview</span>
            </div>
            <p className="text-sm text-aera-muted">Changes are not visible to visitors until published.</p>
          </div>
          <button type="button" onClick={onClose} className="flex h-11 w-11 items-center justify-center rounded-full border border-aera-champagne/60 bg-white text-aera-muted hover:bg-aera-champagne/20 hover:text-aera-ink" aria-label="Close preview">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          <MenuPreviewPanel location={location} items={items} />
        </div>
      </div>
    </div>
  );
}
