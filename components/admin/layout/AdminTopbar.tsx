"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, Bell, ExternalLink } from "lucide-react";
import AdminBreadcrumbs from "./AdminBreadcrumbs";
import AdminQuickActions from "./AdminQuickActions";
import AdminProfileMenu from "./AdminProfileMenu";

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminTopbarProps {
  onMenuOpen: () => void;
  onSearchOpen: () => void;
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminTopbar({
  onMenuOpen,
  onSearchOpen,
}: AdminTopbarProps) {
  const pathname = usePathname();

  return (
    <header className="admin-topbar">
      {/* ── Left Section ─────────────────────────────────────── */}
      <div className="admin-topbar__left">
        {/* Mobile menu button — hidden on desktop via CSS */}
        <button
          onClick={onMenuOpen}
          className="admin-topbar__mobile-menu admin-focus-ring"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        {/* Breadcrumbs — visible on desktop */}
        <div className="hidden lg:block">
          <AdminBreadcrumbs pathname={pathname} />
        </div>
      </div>

      {/* ── Center Section ───────────────────────────────────── */}
      <div className="admin-topbar__center">
        <button
          onClick={onSearchOpen}
          className="admin-topbar__search-trigger admin-focus-ring"
          aria-label="Open search"
        >
          <Search size={16} aria-hidden="true" />
          <span>Search bookings, clients, gift cards…</span>
          <kbd>⌘K</kbd>
        </button>
      </div>

      {/* ── Right Section ────────────────────────────────────── */}
      <div className="admin-topbar__right">
        {/* Quick create */}
        <AdminQuickActions />

        {/* Notifications */}
        <button
          className="admin-topbar__icon-btn admin-focus-ring"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button>

        {/* View Website */}
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-topbar__view-site"
        >
          <ExternalLink size={14} aria-hidden="true" />
          <span>View Site</span>
        </Link>

        {/* Profile */}
        <AdminProfileMenu />
      </div>
    </header>
  );
}
