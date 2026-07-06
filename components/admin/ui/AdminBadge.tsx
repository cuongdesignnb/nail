"use client";

import React from "react";
import clsx from "clsx";

export type AdminBadgeVariant =
  | "default"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "info";

export interface AdminBadgeProps {
  variant?: AdminBadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<AdminBadgeVariant, string> = {
  default:
    "bg-[var(--admin-neutral-soft)] text-[var(--admin-neutral)]",
  accent:
    "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)]",
  success:
    "bg-[var(--admin-success-soft)] text-[var(--admin-success)]",
  warning:
    "bg-[var(--admin-warning-soft)] text-[var(--admin-warning)]",
  danger:
    "bg-[var(--admin-danger-soft)] text-[var(--admin-danger)]",
  info:
    "bg-[var(--admin-info-soft)] text-[var(--admin-info)]",
};

export const AdminBadge: React.FC<AdminBadgeProps> = ({
  variant = "default",
  children,
  className,
}) => {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5",
        "text-[11px] font-semibold leading-none whitespace-nowrap",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export default AdminBadge;
