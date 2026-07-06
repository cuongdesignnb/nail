"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  message?: string;
  onRetry: () => void;
};

export function ContentHubErrorState({ message, onRetry }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-20 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-5">
        <AlertTriangle size={28} className="text-rose-500" />
      </div>

      <h2 className="text-lg font-bold text-[var(--admin-ink)] mb-2">
        Unable to Load Content Hub
      </h2>

      <p className="text-sm text-[var(--admin-muted)] mb-6 leading-relaxed">
        {message || "Something went wrong while fetching page data. Please try again."}
      </p>

      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 bg-[var(--admin-accent)] text-white text-sm font-bold rounded-xl px-5 py-2.5 hover:bg-[var(--admin-accent-hover)] transition-colors shadow-sm"
      >
        <RefreshCw size={15} />
        Retry
      </button>
    </motion.div>
  );
}
