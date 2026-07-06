"use client";

import React, { useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import clsx from "clsx";

export type AdminConfirmDialogVariant = "default" | "danger";

export interface AdminConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: AdminConfirmDialogVariant;
}

export const AdminConfirmDialog: React.FC<AdminConfirmDialogProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "default",
}) => {
  const isDanger = variant === "danger";

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, handleKeyDown]);

  if (typeof window === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[var(--admin-ink)]/30 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md rounded-2xl bg-white border border-[var(--admin-border)] shadow-luxury p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-title"
          >
            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1 text-[var(--admin-muted)] hover:text-[var(--admin-ink)] hover:bg-[var(--admin-surface-hover)] transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Icon */}
            {isDanger && (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 mb-4">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
            )}

            {/* Content */}
            <h2
              id="confirm-dialog-title"
              className="text-base font-bold text-[var(--admin-ink)] pr-8"
            >
              {title}
            </h2>
            {description && (
              <p className="mt-2 text-xs text-[var(--admin-muted)] leading-relaxed">
                {description}
              </p>
            )}

            {/* Actions */}
            <div className="mt-6 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[var(--admin-border-strong)] bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-[var(--admin-ink)] transition-colors hover:bg-[var(--admin-surface-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2"
              >
                {cancelLabel}
              </button>
              <button
                type="button"
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className={clsx(
                  "rounded-full px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
                  isDanger
                    ? "bg-red-600 hover:bg-red-700 focus-visible:ring-red-500/40"
                    : "bg-[var(--admin-accent)] hover:bg-[var(--admin-accent-hover)] focus-visible:ring-[var(--admin-accent)]/40"
                )}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default AdminConfirmDialog;
