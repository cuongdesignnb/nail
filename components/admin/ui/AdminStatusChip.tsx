"use client";

import React from "react";
import clsx from "clsx";

export interface AdminStatusChipProps {
  status: string;
  size?: "sm" | "md";
  className?: string;
}

type StatusColor = {
  dot: string;
  text: string;
  bg: string;
};

const statusColorMap: Record<string, StatusColor> = {
  // Green — positive states
  confirmed: {
    dot: "bg-[var(--admin-success)]",
    text: "text-[var(--admin-success)]",
    bg: "bg-[var(--admin-success-soft)]",
  },
  paid: {
    dot: "bg-[var(--admin-success)]",
    text: "text-[var(--admin-success)]",
    bg: "bg-[var(--admin-success-soft)]",
  },
  active: {
    dot: "bg-[var(--admin-success)]",
    text: "text-[var(--admin-success)]",
    bg: "bg-[var(--admin-success-soft)]",
  },
  published: {
    dot: "bg-[var(--admin-success)]",
    text: "text-[var(--admin-success)]",
    bg: "bg-[var(--admin-success-soft)]",
  },

  // Amber — pending states
  pending: {
    dot: "bg-[var(--admin-warning)]",
    text: "text-[var(--admin-warning)]",
    bg: "bg-[var(--admin-warning-soft)]",
  },
  draft: {
    dot: "bg-[var(--admin-warning)]",
    text: "text-[var(--admin-warning)]",
    bg: "bg-[var(--admin-warning-soft)]",
  },

  // Red — negative states
  cancelled: {
    dot: "bg-[var(--admin-danger)]",
    text: "text-[var(--admin-danger)]",
    bg: "bg-[var(--admin-danger-soft)]",
  },
  failed: {
    dot: "bg-[var(--admin-danger)]",
    text: "text-[var(--admin-danger)]",
    bg: "bg-[var(--admin-danger-soft)]",
  },

  // Neutral brown — completed
  completed: {
    dot: "bg-[var(--admin-neutral)]",
    text: "text-[var(--admin-neutral)]",
    bg: "bg-[var(--admin-neutral-soft)]",
  },

  // Blue — informational
  scheduled: {
    dot: "bg-[var(--admin-info)]",
    text: "text-[var(--admin-info)]",
    bg: "bg-[var(--admin-info-soft)]",
  },
  info: {
    dot: "bg-[var(--admin-info)]",
    text: "text-[var(--admin-info)]",
    bg: "bg-[var(--admin-info-soft)]",
  },

  // Gray — unconfigured
  "not configured": {
    dot: "bg-[var(--admin-placeholder)]",
    text: "text-[var(--admin-muted)]",
    bg: "bg-[var(--admin-surface-muted)]",
  },
};

const defaultColor: StatusColor = {
  dot: "bg-[var(--admin-muted)]",
  text: "text-[var(--admin-muted)]",
  bg: "bg-[var(--admin-neutral-soft)]",
};

function getStatusColor(status: string): StatusColor {
  return statusColorMap[status.toLowerCase()] ?? defaultColor;
}

const sizeClasses = {
  sm: {
    wrapper: "px-2 py-0.5 text-[11px] gap-1.5",
    dot: "h-1.5 w-1.5",
  },
  md: {
    wrapper: "px-2.5 py-1 text-xs gap-2",
    dot: "h-2 w-2",
  },
};

export const AdminStatusChip: React.FC<AdminStatusChipProps> = ({
  status,
  size = "md",
  className,
}) => {
  const color = getStatusColor(status);
  const sizes = sizeClasses[size];

  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full font-medium whitespace-nowrap",
        sizes.wrapper,
        color.bg,
        color.text,
        className
      )}
    >
      <span
        className={clsx("shrink-0 rounded-full", sizes.dot, color.dot)}
        aria-hidden="true"
      />
      <span className="capitalize">{status}</span>
    </span>
  );
};

export default AdminStatusChip;
