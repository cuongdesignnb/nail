"use client";

import Link from "next/link";
import { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  CalendarPlus,
  UserPlus,
  Gem,
  Tags,
  Upload,
  FileEdit,
} from "lucide-react";

/* ────────────────────────────── Quick Action Items ────────────────────────────── */
interface QuickActionItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const quickActions: QuickActionItem[] = [
  { label: "New Booking", href: "/booking", icon: CalendarPlus },
  { label: "Add Customer", href: "/admin/customers", icon: UserPlus },
  { label: "Add Service", href: "/admin/services", icon: Gem },
  { label: "Create Promotion", href: "/admin/promotions/new", icon: Tags },
  { label: "Upload Media", href: "/admin/media", icon: Upload },
  { label: "New Blog Post", href: "/admin/blog/posts?action=new", icon: FileEdit },
];

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminQuickActions() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.target as Node)
    ) {
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, handleClickOutside]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="admin-topbar__icon-btn admin-focus-ring"
        aria-label="Quick actions"
        aria-expanded={open}
      >
        <Plus size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="admin-dropdown absolute right-0 top-[calc(100%+8px)] min-w-[220px]"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="admin-dropdown__item"
                onClick={() => setOpen(false)}
              >
                <action.icon size={16} strokeWidth={1.8} />
                <span>{action.label}</span>
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
