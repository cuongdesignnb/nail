"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AdminSidebarNav from "./AdminSidebarNav";
import { navGroups } from "./AdminSidebar";

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminMobileDrawerProps {
  open: boolean;
  onClose: () => void;
  pathname: string;
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminMobileDrawer({
  open,
  onClose,
  pathname,
}: AdminMobileDrawerProps) {
  /* Body scroll lock */
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Overlay */}
          <motion.div
            className="admin-drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer Panel — slides in from right */}
          <motion.aside
            className="admin-mobile-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            {/* Header */}
            <div className="admin-mobile-drawer__header">
              <Link
                href="/admin"
                className="admin-sidebar__logo-link"
                onClick={onClose}
              >
                <Image
                  src="/aera-mark.svg"
                  alt="Aera"
                  width={32}
                  height={32}
                />
                <span className="admin-sidebar__brand">Aera Nail Lounge</span>
              </Link>

              <button
                onClick={onClose}
                className="admin-mobile-drawer__close admin-focus-ring"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation */}
            <AdminSidebarNav
              groups={navGroups}
              pathname={pathname}
              collapsed={false}
              onItemClick={onClose}
            />
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
