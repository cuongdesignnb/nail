import React from "react";
import clsx from "clsx";

interface StatusBadgeProps {
  active: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({ active, activeLabel = "Active", inactiveLabel = "Inactive" }: StatusBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-sans border",
        {
          "bg-emerald-50 text-emerald-700 border-emerald-200": active,
          "bg-rose-50 text-rose-700 border-rose-200": !active,
        }
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full mr-1.5 shrink-0", {
        "bg-emerald-500": active,
        "bg-rose-500": !active,
      })} />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}
export default StatusBadge;
