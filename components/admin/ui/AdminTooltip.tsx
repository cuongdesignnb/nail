"use client";

import React from "react";
import clsx from "clsx";

export interface AdminTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom";
}

export const AdminTooltip: React.FC<AdminTooltipProps> = ({
  content,
  children,
  position = "top",
}) => {
  return (
    <div className="relative group inline-flex">
      {children}

      <span
        role="tooltip"
        className={clsx(
          "pointer-events-none absolute left-1/2 -translate-x-1/2",
          "rounded-[var(--admin-radius-sm)] bg-[var(--admin-ink)] px-2.5 py-1",
          "text-[11px] font-medium text-white whitespace-nowrap",
          "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
          "group-focus-within:opacity-100 group-focus-within:scale-100",
          "transition-all duration-[var(--admin-transition-fast)]",
          "z-[var(--admin-z-dropdown)]",
          position === "top" && "bottom-full mb-2",
          position === "bottom" && "top-full mt-2"
        )}
      >
        {content}
      </span>
    </div>
  );
};

export default AdminTooltip;
