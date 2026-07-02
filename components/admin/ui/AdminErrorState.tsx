"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw } from "lucide-react";

export interface AdminErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export const AdminErrorState: React.FC<AdminErrorStateProps> = ({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again.",
  onRetry,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 mb-4">
        <AlertTriangle className="h-7 w-7 text-red-500" />
      </div>

      <h3 className="text-sm font-bold text-aera-ink mb-1">{title}</h3>

      <p className="text-xs text-aera-muted max-w-xs leading-relaxed">
        {description}
      </p>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-aera-champagne/60 bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-aera-ink shadow-sm transition-colors hover:bg-aera-champagne/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40 focus-visible:ring-offset-2"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Retry
        </button>
      )}
    </motion.div>
  );
};

export default AdminErrorState;
