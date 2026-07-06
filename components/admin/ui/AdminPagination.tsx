"use client";

import React, { useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

export interface AdminPaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
}) => {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const start = Math.min((page - 1) * pageSize + 1, total);
  const end = Math.min(page * pageSize, total);

  const pages = useMemo(() => {
    const items: (number | "...")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);

      if (page > 3) items.push("...");

      const rangeStart = Math.max(2, page - 1);
      const rangeEnd = Math.min(totalPages - 1, page + 1);

      for (let i = rangeStart; i <= rangeEnd; i++) items.push(i);

      if (page < totalPages - 2) items.push("...");

      items.push(totalPages);
    }

    return items;
  }, [page, totalPages]);

  if (total === 0) return null;

  return (
    <div className="flex flex-col items-center gap-3 py-4 sm:flex-row sm:justify-between">
      <p className="text-xs text-[var(--admin-muted)]">
        Showing{" "}
        <span className="font-semibold text-[var(--admin-ink)]">{start}</span>–
        <span className="font-semibold text-[var(--admin-ink)]">{end}</span> of{" "}
        <span className="font-semibold text-[var(--admin-ink)]">{total}</span>
      </p>

      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {/* Page numbers */}
        {pages.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              className="flex h-8 w-8 items-center justify-center text-xs text-[var(--admin-muted)]"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={clsx(
                "flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition-colors",
                p === page
                  ? "bg-[var(--admin-accent)] text-white shadow-sm"
                  : "text-[var(--admin-muted)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)]"
              )}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--admin-muted)] transition-colors hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)] disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default AdminPagination;
