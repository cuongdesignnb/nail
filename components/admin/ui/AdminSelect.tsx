"use client";

import React, { forwardRef, useId } from "react";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";

export interface AdminSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface AdminSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  options: AdminSelectOption[];
  placeholder?: string;
  selectSize?: "sm" | "md";
}

export const AdminSelect = forwardRef<HTMLSelectElement, AdminSelectProps>(
  (
    {
      label,
      helperText,
      error,
      options,
      placeholder,
      selectSize = "md",
      required,
      disabled,
      className,
      id: propId,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const selectId = propId ?? autoId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;
    const hasError = !!error;

    return (
      <div className={clsx("flex flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-xs font-semibold text-[var(--admin-ink-secondary)] uppercase tracking-wider"
          >
            {label}
            {required && (
              <span className="ml-0.5 text-[var(--admin-danger)]" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            required={required}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={clsx(
              "w-full appearance-none rounded-[var(--admin-radius-md)] border bg-[var(--admin-surface)]",
              "text-sm text-[var(--admin-ink)]",
              "transition-all duration-[var(--admin-transition-fast)]",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              "pr-9 pl-3",
              hasError
                ? "border-[var(--admin-danger)] focus:ring-[var(--admin-danger)]/30"
                : "border-[var(--admin-border-strong)] focus:border-[var(--admin-accent)] focus:ring-[var(--admin-accent)]/20",
              disabled && "opacity-50 cursor-not-allowed bg-[var(--admin-surface-muted)]",
              selectSize === "sm" ? "h-8 text-xs" : "h-10",
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--admin-muted)]"
            aria-hidden="true"
          />
        </div>

        {hasError && (
          <p id={errorId} className="text-[11px] text-[var(--admin-danger)] font-medium">
            {error}
          </p>
        )}

        {!hasError && helperText && (
          <p id={helperId} className="text-[11px] text-[var(--admin-muted)]">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

AdminSelect.displayName = "AdminSelect";

export default AdminSelect;
