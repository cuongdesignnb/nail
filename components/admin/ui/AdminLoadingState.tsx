"use client";

import React from "react";
import clsx from "clsx";

export type AdminLoadingVariant = "card" | "table" | "form";

export interface AdminLoadingStateProps {
  variant?: AdminLoadingVariant;
}

const SkeletonBlock: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={clsx(
      "animate-pulse rounded-lg bg-[var(--admin-accent-soft)]",
      className
    )}
  />
);

const CardSkeleton: React.FC = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: 6 }).map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-[var(--admin-border)] bg-white p-5 space-y-3"
      >
        <SkeletonBlock className="h-4 w-2/3" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
        <div className="flex gap-2 pt-2">
          <SkeletonBlock className="h-7 w-16 rounded-full" />
          <SkeletonBlock className="h-7 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const TableSkeleton: React.FC = () => (
  <div className="rounded-2xl border border-[var(--admin-border)] bg-white overflow-hidden">
    {/* Header */}
    <div className="flex gap-4 px-5 py-3 border-b border-[var(--admin-border)] bg-[var(--admin-surface-muted)]">
      <SkeletonBlock className="h-3 w-24" />
      <SkeletonBlock className="h-3 w-32" />
      <SkeletonBlock className="h-3 w-20" />
      <SkeletonBlock className="h-3 w-16 ml-auto" />
    </div>
    {/* Rows */}
    {Array.from({ length: 5 }).map((_, i) => (
      <div
        key={i}
        className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--admin-surface-muted)] last:border-b-0"
      >
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-3 w-36" />
        <SkeletonBlock className="h-3 w-20" />
        <SkeletonBlock className="h-6 w-14 rounded-full ml-auto" />
      </div>
    ))}
  </div>
);

const FormSkeleton: React.FC = () => (
  <div className="space-y-6 max-w-xl">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="space-y-2">
        <SkeletonBlock className="h-3 w-24" />
        <SkeletonBlock className="h-10 w-full rounded-xl" />
      </div>
    ))}
    <div className="flex gap-3 pt-2">
      <SkeletonBlock className="h-9 w-28 rounded-full" />
      <SkeletonBlock className="h-9 w-20 rounded-full" />
    </div>
  </div>
);

export const AdminLoadingState: React.FC<AdminLoadingStateProps> = ({
  variant = "card",
}) => {
  switch (variant) {
    case "table":
      return <TableSkeleton />;
    case "form":
      return <FormSkeleton />;
    case "card":
    default:
      return <CardSkeleton />;
  }
};

export default AdminLoadingState;
