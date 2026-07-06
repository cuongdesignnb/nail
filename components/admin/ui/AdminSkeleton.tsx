"use client";

import React from "react";
import clsx from "clsx";

export type AdminSkeletonVariant = "line" | "circle" | "rect" | "card";

export interface AdminSkeletonProps {
  variant?: AdminSkeletonVariant;
  width?: string;
  height?: string;
  className?: string;
}

const baseShimmer =
  "bg-gradient-to-r from-[var(--admin-surface-muted)] via-[var(--admin-surface-hover)] to-[var(--admin-surface-muted)] bg-[length:200%_100%] animate-[admin-shimmer_1.5s_ease-in-out_infinite]";

const variantDefaults: Record<
  AdminSkeletonVariant,
  { defaultWidth: string; defaultHeight: string; shape: string }
> = {
  line: {
    defaultWidth: "100%",
    defaultHeight: "14px",
    shape: "rounded-[var(--admin-radius-sm)]",
  },
  circle: {
    defaultWidth: "40px",
    defaultHeight: "40px",
    shape: "rounded-full",
  },
  rect: {
    defaultWidth: "100%",
    defaultHeight: "80px",
    shape: "rounded-[var(--admin-radius-md)]",
  },
  card: {
    defaultWidth: "100%",
    defaultHeight: "120px",
    shape: "rounded-[var(--admin-radius-lg)]",
  },
};

export const AdminSkeleton: React.FC<AdminSkeletonProps> = ({
  variant = "line",
  width,
  height,
  className,
}) => {
  const config = variantDefaults[variant];

  return (
    <div
      className={clsx(baseShimmer, config.shape, className)}
      style={{
        width: width ?? config.defaultWidth,
        height: height ?? config.defaultHeight,
      }}
      aria-hidden="true"
    />
  );
};

export default AdminSkeleton;
