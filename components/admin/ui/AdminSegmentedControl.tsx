"use client";

import React from "react";
import clsx from "clsx";

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface AdminSegmentedControlProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const AdminSegmentedControl: React.FC<AdminSegmentedControlProps> = ({
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div
      role="radiogroup"
      className={clsx(
        "inline-flex items-center gap-0.5 p-1",
        "rounded-[var(--admin-radius-lg)] bg-[var(--admin-surface-muted)]",
        "border border-[var(--admin-border)]",
        className
      )}
    >
      {options.map((option) => {
        const isActive = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => onChange(option.value)}
            className={clsx(
              "relative px-4 py-1.5 text-xs font-semibold whitespace-nowrap",
              "rounded-[var(--admin-radius-md)]",
              "transition-all duration-[var(--admin-transition-fast)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-1",
              isActive
                ? "bg-[var(--admin-surface)] text-[var(--admin-accent)] shadow-[var(--admin-shadow-sm)] border border-[var(--admin-border)]"
                : "text-[var(--admin-muted)] hover:text-[var(--admin-ink)] border border-transparent"
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};

export default AdminSegmentedControl;
