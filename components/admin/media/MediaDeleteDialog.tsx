"use client";

import React from "react";
import { AlertTriangle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MediaDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  assetName: string;
}

export function MediaDeleteDialog({
  open,
  onClose,
  onConfirm,
  assetName,
}: MediaDeleteDialogProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white rounded-2xl shadow-luxury border border-aera-champagne/50 p-6 w-full max-w-sm"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-aera-muted hover:text-aera-ink transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={20} className="text-rose-500" />
              </div>
              <div>
                <h3 className="font-heading text-base font-semibold text-aera-ink">
                  Delete Asset
                </h3>
                <p className="text-xs text-aera-muted">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-xs text-aera-ink mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">&ldquo;{assetName}&rdquo;</span>?
              This will remove it from the media library.
            </p>

            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-aera-ink bg-gray-100 hover:bg-gray-200 rounded-full transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-500 hover:bg-rose-600 rounded-full transition-colors cursor-pointer shadow-sm"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default MediaDeleteDialog;
