"use client";

import React from "react";
import { Download, RotateCcw } from "lucide-react";

export interface AdminFilterBarProps {
  children: React.ReactNode;
  onReset?: () => void;
  onExport?: () => void;
  className?: string;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  children,
  onReset,
  onExport,
  className,
}) => {
  return (
    <div
      className={`bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius-lg)] p-4 ${className ?? ""}`}
    >
      <div className="flex items-center gap-3 flex-wrap">
        {/* Filter controls */}
        <div className="flex items-center gap-3 flex-wrap flex-1 min-w-0">
          {children}
        </div>

        {/* Action buttons */}
        {(onReset || onExport) && (
          <div className="flex items-center gap-2 shrink-0">
            {onReset && (
              <button
                type="button"
                onClick={onReset}
                aria-label="Reset filters"
                className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)] transition-colors hover:text-[var(--admin-ink)] hover:bg-[var(--admin-border)]/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </button>
            )}

            {onExport && (
              <button
                type="button"
                onClick={onExport}
                aria-label="Export data"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--admin-border)] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[var(--admin-ink-secondary)] transition-colors hover:bg-[var(--admin-canvas)] hover:border-[var(--admin-border-strong)] hover:text-[var(--admin-ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40"
              >
                <Download className="h-3 w-3" />
                Export
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminFilterBar;
