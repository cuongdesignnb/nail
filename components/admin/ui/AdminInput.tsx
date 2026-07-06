"use client";

import React, { forwardRef, useId } from "react";
import clsx from "clsx";

export interface AdminInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  inputSize?: "sm" | "md";
}

export const AdminInput = forwardRef<HTMLInputElement, AdminInputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      inputSize = "md",
      required,
      disabled,
      className,
      id: propId,
      ...props
    },
    ref
  ) => {
    const autoId = useId();
    const inputId = propId ?? autoId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const hasError = !!error;

    return (
      <div className={clsx("flex flex-col gap-1.5", className)}>
        {label && (
          <label
            htmlFor={inputId}
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
          {leftIcon && (
            <span
              className={clsx(
                "absolute left-3 top-1/2 -translate-y-1/2 text-[var(--admin-placeholder)]",
                "[&>svg]:h-4 [&>svg]:w-4"
              )}
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            required={required}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            className={clsx(
              "w-full rounded-[var(--admin-radius-md)] border bg-[var(--admin-surface)]",
              "text-sm text-[var(--admin-ink)] placeholder:text-[var(--admin-placeholder)]",
              "transition-all duration-[var(--admin-transition-fast)]",
              "focus:outline-none focus:ring-2 focus:ring-offset-0",
              hasError
                ? "border-[var(--admin-danger)] focus:ring-[var(--admin-danger)]/30"
                : "border-[var(--admin-border-strong)] focus:border-[var(--admin-accent)] focus:ring-[var(--admin-accent)]/20",
              disabled && "opacity-50 cursor-not-allowed bg-[var(--admin-surface-muted)]",
              leftIcon ? "pl-9" : "pl-3",
              inputSize === "sm" ? "h-8 pr-3 text-xs" : "h-10 pr-3",
            )}
            {...props}
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

AdminInput.displayName = "AdminInput";

export default AdminInput;
