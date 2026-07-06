"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ExternalLink,
  Settings,
  LogOut,
  ChevronDown,
} from "lucide-react";

/* ────────────────────────────── Helpers ────────────────────────────── */
function getAdminFromCookie(): { email: string; name: string } {
  const fallback = { email: "", name: "Admin" };

  if (typeof document === "undefined") return fallback;

  try {
    const cookies = document.cookie.split(";");
    const sessionCookie = cookies.find((c) =>
      c.trim().startsWith("aera_admin_session=")
    );
    if (!sessionCookie) return fallback;

    const token = sessionCookie.split("=")[1]?.trim();
    if (!token) return fallback;

    /* Decode JWT payload (base64url → JSON). No verification needed client-side. */
    const payloadB64 = token.split(".")[1];
    if (!payloadB64) return fallback;

    const payload = JSON.parse(
      atob(payloadB64.replace(/-/g, "+").replace(/_/g, "/"))
    );

    const email = payload.email || "";
    const name = payload.name || email.split("@")[0] || "Admin";
    return { email, name };
  } catch {
    return fallback;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminProfileMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const admin = useMemo(() => getAdminFromCookie(), []);
  const initials = useMemo(() => getInitials(admin.name), [admin.name]);

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

  /* Sign out handler */
  function handleSignOut() {
    document.cookie =
      "aera_admin_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    router.push("/login");
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="admin-topbar__profile admin-focus-ring"
        aria-label="Profile menu"
        aria-expanded={open}
      >
        <div className="admin-topbar__avatar" aria-hidden="true">
          {initials}
        </div>
        <div className="admin-topbar__profile-info">
          <span className="admin-topbar__profile-name">{admin.name}</span>
          <span className="admin-topbar__profile-role">Owner</span>
        </div>
        <ChevronDown
          size={14}
          className="text-[var(--admin-muted)] hidden lg:block"
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="admin-dropdown absolute right-0 top-[calc(100%+8px)] min-w-[200px]"
            initial={{ opacity: 0, scale: 0.96, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -4 }}
            transition={{ duration: 0.16 }}
          >
            {/* Profile header in dropdown */}
            <div className="px-3 py-2.5">
              <p className="text-[13px] font-semibold text-[var(--admin-ink)]">
                {admin.name}
              </p>
              {admin.email && (
                <p className="text-[11px] text-[var(--admin-muted)] truncate">
                  {admin.email}
                </p>
              )}
            </div>

            <div className="admin-dropdown__separator" />

            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="admin-dropdown__item"
              onClick={() => setOpen(false)}
            >
              <ExternalLink size={15} strokeWidth={1.8} />
              <span>View Website</span>
            </Link>

            <Link
              href="/admin/settings"
              className="admin-dropdown__item"
              onClick={() => setOpen(false)}
            >
              <Settings size={15} strokeWidth={1.8} />
              <span>Settings</span>
            </Link>

            <div className="admin-dropdown__separator" />

            <button
              onClick={handleSignOut}
              className="admin-dropdown__item admin-dropdown__item--danger"
            >
              <LogOut size={15} strokeWidth={1.8} />
              <span>Sign Out</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
