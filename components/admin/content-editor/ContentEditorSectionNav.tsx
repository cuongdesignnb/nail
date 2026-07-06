"use client";

import { useRef, useEffect } from "react";
import { ContentSectionCompletion } from "./ContentSectionCompletion";
import type { ContentSectionDef } from "@/lib/content/content.types";

interface ContentEditorSectionNavProps {
  sections: ContentSectionDef[];
  activeKey: string;
  onSelect: (key: string) => void;
  /** Map of section IDs to whether they have content */
  completionMap: Record<string, boolean>;
}

/**
 * Left sidebar navigation listing all sections for the current page.
 * On desktop: vertical sidebar nav (220px).
 * On mobile: horizontal scrollable tabs.
 */
export function ContentEditorSectionNav({
  sections,
  activeKey,
  onSelect,
  completionMap,
}: ContentEditorSectionNavProps) {
  const activeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // On mobile, scroll active tab into view
  useEffect(() => {
    if (activeRef.current && scrollRef.current) {
      activeRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeKey]);

  return (
    <>
      {/* Desktop: vertical sidebar nav */}
      <nav className="hidden lg:block">
        <p className="text-[10px] font-bold uppercase tracking-[1.4px] text-[var(--admin-muted)] px-3 mb-2">
          Sections
        </p>
        <div className="space-y-0.5">
          {sections.map((s) => {
            const isActive = s.id === activeKey;
            const isComplete = completionMap[s.id] ?? false;

            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className={`w-full flex items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[12px] font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--admin-accent)]/8 text-[var(--admin-accent)] font-bold shadow-sm border border-[var(--admin-accent)]/15"
                    : "text-[var(--admin-ink)]/70 hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)] border border-transparent"
                }`}
              >
                <span className="truncate flex-1">{s.label}</span>
                <ContentSectionCompletion complete={isComplete} size="sm" />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile: horizontal scroll tabs */}
      <div
        ref={scrollRef}
        className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide"
      >
        {sections.map((s) => {
          const isActive = s.id === activeKey;
          const isComplete = completionMap[s.id] ?? false;

          return (
            <button
              key={s.id}
              ref={isActive ? activeRef : undefined}
              onClick={() => onSelect(s.id)}
              className={`flex-shrink-0 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold transition-all whitespace-nowrap ${
                isActive
                  ? "bg-[var(--admin-accent)] text-white shadow-sm"
                  : "bg-white border border-[var(--admin-border)]/40 text-[var(--admin-ink)]/70 hover:border-[var(--admin-accent)]/30"
              }`}
            >
              {s.label}
              {!isActive && (
                <ContentSectionCompletion complete={isComplete} size="sm" />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
