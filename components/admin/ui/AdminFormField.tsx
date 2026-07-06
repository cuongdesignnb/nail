"use client";

import React from "react";
import clsx from "clsx";

export interface AdminFormFieldProps {
  label?: string;
  error?: string;
  helpText?: string;
  required?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}

export const AdminFormField: React.FC<AdminFormFieldProps> = ({
  label,
  error,
  helpText,
  required,
  children,
  htmlFor,
}) => {
  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={htmlFor}
          className="block text-xs font-semibold text-[var(--admin-ink)]"
        >
          {label}
          {required && (
            <span className="ml-0.5 text-red-500" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      {children}

      {error && (
        <p
          className={clsx(
            "text-[11px] font-medium text-red-600 leading-tight"
          )}
          role="alert"
        >
          {error}
        </p>
      )}

      {helpText && !error && (
        <p className="text-[11px] text-[var(--admin-muted)] leading-tight">{helpText}</p>
      )}
    </div>
  );
};

export default AdminFormField;
