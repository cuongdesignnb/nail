"use client";

import React from "react";
import clsx from "clsx";

export type AdminStatusType =
  | "published"
  | "draft"
  | "scheduled"
  | "archived"
  | "not-configured";

export interface AdminStatusBadgeProps {
  status: AdminStatusType;
}

const STATUS_CONFIG: Record<
  AdminStatusType,
  { label: string; dot: string; bg: string; text: string }
> = {
  published: {
    label: "Published",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  draft: {
    label: "Draft",
    dot: "bg-amber-500",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  scheduled: {
    label: "Scheduled",
    dot: "bg-blue-500",
    bg: "bg-blue-50",
    text: "text-blue-700",
  },
  archived: {
    label: "Archived",
    dot: "bg-gray-400",
    bg: "bg-gray-50",
    text: "text-gray-600",
  },
  "not-configured": {
    label: "Not Configured",
    dot: "bg-red-500",
    bg: "bg-red-50",
    text: "text-red-700",
  },
};

export const AdminStatusBadge: React.FC<AdminStatusBadgeProps> = ({
  status,
}) => {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
        config.bg,
        config.text
      )}
    >
      <span
        className={clsx("h-1.5 w-1.5 rounded-full shrink-0", config.dot)}
      />
      {config.label}
    </span>
  );
};

export default AdminStatusBadge;
