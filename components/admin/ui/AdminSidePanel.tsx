"use client";

import React, { useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export interface AdminSidePanelProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  width?: string;
}

export const AdminSidePanel: React.FC<AdminSidePanelProps> = ({
  open,
  onClose,
  title,
  children,
  width = "480px",
}) => {
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

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-aera-ink/25 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute right-0 top-0 bottom-0 flex flex-col bg-white border-l border-aera-champagne/30 shadow-luxury overflow-hidden"
            style={{ width, maxWidth: "100vw" }}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Side panel"}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-aera-champagne/30 px-6 py-4 shrink-0">
              {title && (
                <h2 className="text-sm font-bold text-aera-ink truncate">
                  {title}
                </h2>
              )}
              <button
                type="button"
                onClick={onClose}
                className="ml-auto rounded-lg p-1.5 text-aera-muted hover:text-aera-ink hover:bg-aera-champagne/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AdminSidePanel;
