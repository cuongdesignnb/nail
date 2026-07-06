"use client";

import { motion } from "framer-motion";

/**
 * Loading skeleton for the 3-column content editor layout.
 * Shows animated pulse placeholders while content loads.
 */
export function ContentEditorSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-3 w-20 animate-pulse rounded bg-[var(--admin-border-muted)]" />
          <div className="h-3 w-3 animate-pulse rounded bg-[var(--admin-surface-muted)]" />
          <div className="h-3 w-28 animate-pulse rounded bg-[var(--admin-border-muted)]" />
        </div>
        <div className="h-8 w-64 animate-pulse rounded-lg bg-[var(--admin-border-muted)]" />
        <div className="flex items-center gap-3">
          <div className="h-5 w-24 animate-pulse rounded-full bg-[var(--admin-surface-muted)]" />
          <div className="h-4 w-32 animate-pulse rounded bg-[var(--admin-surface-hover)]" />
        </div>
      </div>

      {/* 3-Column Layout Skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr_300px]"
      >
        {/* Left Nav Skeleton */}
        <div className="hidden lg:block">
          <div className="space-y-2 rounded-2xl border border-[var(--admin-border)]/20 bg-white/80 p-4">
            <div className="mb-3 h-3 w-16 animate-pulse rounded bg-[var(--admin-border-muted)]" />
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-xl p-2"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="h-4 w-4 animate-pulse rounded bg-[var(--admin-surface-muted)]" />
                <div
                  className="h-3.5 animate-pulse rounded bg-[var(--admin-surface-muted)]"
                  style={{ width: `${60 + Math.random() * 60}px` }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Center Content Skeleton */}
        <div className="space-y-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-[var(--admin-border)]/20 bg-white/80 p-5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-8 animate-pulse rounded-lg bg-[var(--admin-surface-muted)]" />
                <div className="h-4 w-32 animate-pulse rounded bg-[var(--admin-border-muted)]" />
              </div>
              <div className="space-y-3">
                <div className="h-3 w-full animate-pulse rounded bg-[var(--admin-surface-hover)]" />
                <div className="h-3 w-3/4 animate-pulse rounded bg-[var(--admin-surface-hover)]" />
                <div className="h-9 w-full animate-pulse rounded-lg bg-[var(--admin-surface-muted)]" />
                <div className="h-3 w-5/6 animate-pulse rounded bg-[var(--admin-surface-hover)]" />
                <div className="h-9 w-full animate-pulse rounded-lg bg-[var(--admin-surface-muted)]" />
              </div>
            </div>
          ))}
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="hidden lg:block">
          <div className="space-y-4 rounded-2xl border border-[var(--admin-border)]/20 bg-white/80 p-4">
            <div className="mb-3 h-3 w-12 animate-pulse rounded bg-[var(--admin-border-muted)]" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-[var(--admin-surface-muted)]" />
            <div className="space-y-2 pt-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <div className="h-3 w-16 animate-pulse rounded bg-[var(--admin-surface-hover)]" />
                  <div className="h-3 w-20 animate-pulse rounded bg-[var(--admin-surface-muted)]" />
                </div>
              ))}
            </div>
            <div className="space-y-2.5 pt-3">
              <div className="h-10 w-full animate-pulse rounded-xl bg-[var(--admin-surface-muted)]" />
              <div className="h-10 w-full animate-pulse rounded-xl bg-[var(--admin-surface-hover)]" />
              <div className="h-px w-full bg-[var(--admin-surface-hover)]" />
              <div className="h-9 w-full animate-pulse rounded-xl bg-[var(--admin-surface-muted)]" />
              <div className="h-8 w-full animate-pulse rounded bg-[var(--admin-surface-muted)]" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
