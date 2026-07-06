"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface AdminIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  "aria-label": string;
  variant?: "default" | "ghost" | "danger";
  size?: "sm" | "md";
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  default:
    "text-[var(--admin-muted)] bg-[var(--admin-surface)] border border-[var(--admin-border)] hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)]",
  ghost:
    "text-[var(--admin-muted)] bg-transparent hover:bg-[var(--admin-surface-hover)] hover:text-[var(--admin-ink)]",
  danger:
    "text-[var(--admin-danger)] bg-transparent hover:bg-[var(--admin-danger-soft)]",
};

const sizeClasses: Record<string, string> = {
  sm: "h-7 w-7 rounded-[var(--admin-radius-sm)]",
  md: "h-9 w-9 rounded-[var(--admin-radius-md)]",
};

const iconSizeClasses: Record<string, string> = {
  sm: "[&>svg]:h-3.5 [&>svg]:w-3.5",
  md: "[&>svg]:h-4 [&>svg]:w-4",
};

export const AdminIconButton = forwardRef<
  HTMLButtonElement,
  AdminIconButtonProps
>(
  (
    {
      "aria-label": ariaLabel,
      variant = "default",
      size = "md",
      children,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative group inline-flex">
        <button
          ref={ref}
          type="button"
          aria-label={ariaLabel}
          className={clsx(
            "inline-flex items-center justify-center",
            "transition-all duration-[var(--admin-transition-fast)]",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2",
            "disabled:opacity-50 disabled:pointer-events-none",
            variantClasses[variant],
            sizeClasses[size],
            iconSizeClasses[size],
            className
          )}
          {...props}
        >
          {children}
        </button>

        {/* Tooltip */}
        <span
          role="tooltip"
          className={clsx(
            "pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-full mb-2",
            "rounded-[var(--admin-radius-sm)] bg-[var(--admin-ink)] px-2.5 py-1",
            "text-[11px] font-medium text-white whitespace-nowrap",
            "opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100",
            "transition-all duration-[var(--admin-transition-fast)]",
            "z-[var(--admin-z-dropdown)]"
          )}
        >
          {ariaLabel}
        </span>
      </div>
    );
  }
);

AdminIconButton.displayName = "AdminIconButton";

export default AdminIconButton;
