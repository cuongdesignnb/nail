"use client";

import React from "react";
import clsx from "clsx";

export interface AdminStatCardProps {
  label: string;
  value: string | number;
  trend?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const AdminStatCard: React.FC<AdminStatCardProps> = ({
  label,
  value,
  trend,
  icon,
  className,
}) => {
  return (
    <div
      className={clsx(
        "bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius-lg)]",
        "shadow-[var(--admin-shadow-sm)] p-5",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-[var(--admin-muted)] uppercase tracking-wider">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-[var(--admin-ink)] font-heading truncate">
            {value}
          </p>
          {trend && <div className="mt-2">{trend}</div>}
        </div>

        {icon && (
          <div
            className={clsx(
              "flex h-10 w-10 shrink-0 items-center justify-center",
              "rounded-[var(--admin-radius-md)] bg-[var(--admin-accent-soft)]",
              "text-[var(--admin-accent)]",
              "[&>svg]:h-5 [&>svg]:w-5"
            )}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminStatCard;
