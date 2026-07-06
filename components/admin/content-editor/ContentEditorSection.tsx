"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

interface ContentEditorSectionProps {
  id: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  /** Whether the section starts open, defaults to true */
  defaultOpen?: boolean;
}

/**
 * Collapsible section wrapper for content editor forms.
 * Shows a section title with collapse toggle, wraps form content.
 */
export function ContentEditorSection({
  id,
  title,
  description,
  children,
  defaultOpen = true,
}: ContentEditorSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      id={`section-${id}`}
      className="rounded-2xl border border-[var(--admin-border)]/20 bg-white/90 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
    >
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-[var(--admin-surface-hover)] transition-colors"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--admin-accent-soft)] to-[var(--admin-surface-muted)] flex-shrink-0">
          <span className="text-xs font-bold text-[var(--admin-accent)]">
            {title.charAt(0)}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold text-[var(--admin-ink)] truncate">{title}</h3>
          {description && (
            <p className="text-[11px] text-[var(--admin-muted)] truncate">{description}</p>
          )}
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex-shrink-0"
        >
          <ChevronDown size={16} className="text-[var(--admin-muted)]" />
        </motion.div>
      </button>

      {/* Section Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="border-t border-[var(--admin-border)]/20 px-5 py-5">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
