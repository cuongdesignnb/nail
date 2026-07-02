"use client";

import React, { useId } from "react";
import clsx from "clsx";
import { AdminFormField } from "./AdminFormField";

export interface AdminTextAreaProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helpText?: string;
  required?: boolean;
  rows?: number;
  placeholder?: string;
  maxLength?: number;
}

export const AdminTextArea: React.FC<AdminTextAreaProps> = ({
  label,
  value,
  onChange,
  error,
  helpText,
  required,
  rows = 4,
  placeholder,
  maxLength,
}) => {
  const id = useId();

  return (
    <AdminFormField
      label={label}
      error={error}
      helpText={helpText}
      required={required}
      htmlFor={id}
    >
      <div className="relative">
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          className={clsx(
            "w-full rounded-xl border bg-white px-3.5 py-2.5 text-xs text-aera-ink placeholder:text-aera-muted/50 resize-y min-h-[80px]",
            "transition-colors focus:outline-none focus:ring-2",
            error
              ? "border-red-300 focus:border-red-500 focus:ring-red-200"
              : "border-aera-champagne/60 focus:border-aera-accent focus:ring-aera-accent/20"
          )}
        />

        {maxLength !== undefined && (
          <div className="mt-1 flex justify-end">
            <span
              className={clsx(
                "text-[10px] font-medium tabular-nums",
                value.length > maxLength * 0.9
                  ? "text-amber-600"
                  : "text-aera-muted/60"
              )}
            >
              {value.length}/{maxLength}
            </span>
          </div>
        )}
      </div>
    </AdminFormField>
  );
};

export default AdminTextArea;
