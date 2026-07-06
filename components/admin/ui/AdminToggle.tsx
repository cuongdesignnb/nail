"use client";

import React, { useId } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export interface AdminToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  helpText?: string;
}

export const AdminToggle: React.FC<AdminToggleProps> = ({
  label,
  checked,
  onChange,
  helpText,
}) => {
  const id = useId();

  return (
    <div className="flex items-start gap-3">
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx(
          "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2",
          checked ? "bg-[var(--admin-accent)]" : "bg-[var(--admin-border)]"
        )}
      >
        <motion.span
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className={clsx(
            "pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0",
            checked ? "translate-x-5" : "translate-x-0"
          )}
        />
      </button>

      {(label || helpText) && (
        <div className="min-w-0">
          {label && (
            <label
              htmlFor={id}
              className="block text-xs font-semibold text-[var(--admin-ink)] cursor-pointer"
            >
              {label}
            </label>
          )}
          {helpText && (
            <p className="mt-0.5 text-[11px] text-[var(--admin-muted)] leading-relaxed">
              {helpText}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminToggle;
