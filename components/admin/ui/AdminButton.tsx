"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface AdminButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary:
    "bg-[var(--admin-accent)] text-white hover:bg-[var(--admin-accent-hover)] focus-visible:ring-[var(--admin-accent)]/40 shadow-sm",
  secondary:
    "border border-[var(--admin-border-strong)] text-[var(--admin-accent)] bg-white hover:bg-[var(--admin-surface-muted)] focus-visible:ring-[var(--admin-accent)]/40",
  tertiary:
    "bg-[var(--admin-accent-soft)] text-[var(--admin-accent)] hover:bg-[var(--admin-accent-muted)] focus-visible:ring-[var(--admin-accent)]/40",
  danger:
    "bg-[var(--admin-danger)] text-white hover:bg-[#a12828] focus-visible:ring-[var(--admin-danger)]/40 shadow-sm",
  ghost:
    "bg-transparent text-[var(--admin-muted)] hover:text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)] focus-visible:ring-[var(--admin-accent)]/40",
};

const sizeClasses: Record<string, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-[var(--admin-radius-sm)]",
  md: "h-9 px-4 text-sm gap-2 rounded-[var(--admin-radius-md)]",
  lg: "h-11 px-6 text-sm gap-2.5 rounded-[var(--admin-radius-md)]",
};

export const AdminButton = forwardRef<HTMLButtonElement, AdminButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      icon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center font-semibold whitespace-nowrap",
          "transition-all duration-[var(--admin-transition-fast)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          "disabled:opacity-50 disabled:pointer-events-none",
          "select-none",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <svg
            className="h-4 w-4 animate-[admin-spin_0.7s_linear_infinite]"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        ) : icon ? (
          <span className="shrink-0" aria-hidden="true">
            {icon}
          </span>
        ) : null}
        <span>{children}</span>
      </button>
    );
  }
);

AdminButton.displayName = "AdminButton";

export default AdminButton;
