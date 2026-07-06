"use client";

import { useState } from "react";
import { AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const COLLAPSED_LIMIT = 3;

export function ContentCompletionList({ missing }: { missing: string[] }) {
  const [expanded, setExpanded] = useState(false);

  if (missing.length === 0) return null;

  const needsCollapse = missing.length > COLLAPSED_LIMIT;
  const visible = expanded ? missing : missing.slice(0, COLLAPSED_LIMIT);
  const hiddenCount = missing.length - COLLAPSED_LIMIT;

  return (
    <div className="mt-3 pt-3 border-t border-[var(--admin-border)]/40">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--admin-muted)] mb-2">
        Missing Content ({missing.length})
      </p>

      <ul className="space-y-1">
        {visible.map((item) => (
          <li
            key={item}
            className="flex items-center gap-1.5 text-[11px] text-amber-700/80"
          >
            <AlertTriangle size={11} className="shrink-0" />
            <span className="truncate">{item}</span>
          </li>
        ))}
      </ul>

      <AnimatePresence>
        {needsCollapse && !expanded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(true);
            }}
            className="flex items-center gap-1 mt-1.5 text-[11px] font-medium text-[var(--admin-accent)] hover:text-[var(--admin-accent)]Hover transition-colors"
          >
            +{hiddenCount} more <ChevronDown size={12} />
          </motion.button>
        )}
        {needsCollapse && expanded && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setExpanded(false);
            }}
            className="flex items-center gap-1 mt-1.5 text-[11px] font-medium text-[var(--admin-accent)] hover:text-[var(--admin-accent)]Hover transition-colors"
          >
            Show less <ChevronUp size={12} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
