"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminMobileDrawer from "./AdminMobileDrawer";
import AdminTopbar from "./AdminTopbar";
import AdminGlobalSearch from "./AdminGlobalSearch";

/* ────────────────────────────── Constants ────────────────────────────── */
const SIDEBAR_STORAGE_KEY = "aera_sidebar_collapsed";

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminShellProps {
  children: React.ReactNode;
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* ── Restore sidebar collapsed state from localStorage ──────── */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (stored === "true") setCollapsed(true);
    } catch {
      /* localStorage may be unavailable */
    }
  }, []);

  /* ── Toggle sidebar collapse ────────────────────────────────── */
  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        /* Ignore storage errors */
      }
      return next;
    });
  }, []);

  /* ── Close drawer on route change ───────────────────────────── */
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  /* ── Global ⌘K / Ctrl+K shortcut ───────────────────────────── */
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  /* ── Shell class names ──────────────────────────────────────── */
  const shellClassName = [
    "admin-shell",
    collapsed ? "admin-shell--collapsed" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={shellClassName}>
      {/* Desktop Sidebar */}
      <AdminSidebar
        collapsed={collapsed}
        onToggle={toggleCollapse}
        pathname={pathname}
      />

      {/* Mobile Navigation Drawer */}
      <AdminMobileDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        pathname={pathname}
      />

      {/* Content Area: Topbar + Main */}
      <div className="admin-content-area">
        <AdminTopbar
          onMenuOpen={() => setDrawerOpen(true)}
          onSearchOpen={() => setSearchOpen(true)}
        />

        <main className="admin-main">{children}</main>
      </div>

      {/* Global Search (Command Palette) */}
      <AdminGlobalSearch
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </div>
  );
}
