"use client";

import { GripVertical } from "lucide-react";
import type { NavigationMenuItem } from "@/lib/navigation/navigation.types";

export function MenuDragOverlay({ item }: { item?: NavigationMenuItem | null }) {
  if (!item) return null;
  return (
    <div className="rounded-2xl border border-aera-accent/30 bg-white px-4 py-3 shadow-2xl">
      <div className="flex items-center gap-3">
        <GripVertical className="h-4 w-4 text-aera-accent" />
        <div>
          <p className="text-sm font-bold text-aera-ink">{item.label || "Untitled link"}</p>
          <p className="text-[11px] text-aera-muted">{item.href || "Needs destination"}</p>
        </div>
      </div>
    </div>
  );
}
