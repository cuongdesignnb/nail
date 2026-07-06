"use client";

import React from "react";
import clsx from "clsx";

export interface AdminSectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const AdminSectionHeader: React.FC<AdminSectionHeaderProps> = ({
  title,
  description,
  action,
  className,
}) => {
  return (
    <div
      className={clsx(
        "flex items-start justify-between gap-4",
        className
      )}
    >
      <div className="min-w-0 flex-1">
        <h2 className="text-lg font-bold text-[var(--admin-ink)] font-heading">
          {title}
        </h2>
        {description && (
          <p className="mt-1 text-sm text-[var(--admin-muted)] leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default AdminSectionHeader;
