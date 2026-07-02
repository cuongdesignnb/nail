"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";

interface BlogPaginationProps {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function BlogPagination({ pagination }: BlogPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!pagination || pagination.totalPages <= 1) return null;

  const { page, totalPages } = pagination;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(newPage));
      router.push(`/blog?${params.toString()}`, { scroll: true });
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }
      
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      
      if (page < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-8 font-sans">
      {/* Prev arrow */}
      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="w-8 h-8 rounded-full border border-aera-champagne bg-white hover:bg-aera-cream text-aera-muted hover:text-aera-accent flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
        aria-label="Previous page"
      >
        &laquo;
      </button>

      {/* Pages list */}
      {getPageNumbers().map((p, idx) => {
        if (p === "...") {
          return (
            <span key={`dots-${idx}`} className="px-2 text-xs text-aera-muted">
              ...
            </span>
          );
        }

        const isCurrent = page === p;
        return (
          <button
            key={`page-${p}`}
            onClick={() => handlePageChange(Number(p))}
            className={clsx(
              "w-8 h-8 rounded-full border text-xs font-semibold cursor-pointer transition-all flex items-center justify-center",
              {
                "bg-aera-accent text-white border-aera-accent font-bold shadow-sm": isCurrent,
                "bg-white text-aera-muted border-aera-champagne hover:border-aera-accent hover:text-aera-accent": !isCurrent,
              }
            )}
          >
            {p}
          </button>
        );
      })}

      {/* Next arrow */}
      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-full border border-aera-champagne bg-white hover:bg-aera-cream text-aera-muted hover:text-aera-accent flex items-center justify-center cursor-pointer disabled:opacity-40 disabled:hover:bg-white disabled:cursor-not-allowed transition-all"
        aria-label="Next page"
      >
        &raquo;
      </button>
    </div>
  );
}
export default BlogPagination;
