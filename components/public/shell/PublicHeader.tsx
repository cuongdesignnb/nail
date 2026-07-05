"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { BrandLogo } from "./BrandLogo";
import { PublicHeaderCta } from "./PublicHeaderCta";
import { PublicHeaderDesktopNav } from "./PublicHeaderDesktopNav";
import { PublicHeaderMobileNav } from "./PublicHeaderMobileNav";
import type { PublicShellData } from "@/lib/site-shell/public-shell.types";

export function PublicHeader({ data }: { data: PublicShellData }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname() || "/";
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onPointerDown(event: MouseEvent) {
      if (!open || !drawerRef.current) return;
      if (!drawerRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [open]);

  return (
    <>
      <header className="aera-public-header">
        <div className="aera-public-header__inner">
          <BrandLogo brandName={data.brand.name} logo={data.brand.logo} priority />
          <PublicHeaderDesktopNav items={data.header.primaryMenu} pathname={pathname} />
          <PublicHeaderCta cta={data.header.cta} />
          <button className="aera-public-header__mobile-trigger" type="button" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <Menu size={22} />
          </button>
        </div>
      </header>
      <div className={`aera-public-mobile-overlay ${open ? "is-open" : ""}`} aria-hidden="true" />
      <aside ref={drawerRef} className={`aera-public-mobile-drawer ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <div className="aera-public-mobile-drawer__header">
          <BrandLogo brandName={data.brand.name} logo={data.brand.logo} size="mobile" />
          <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
            <X size={22} />
          </button>
        </div>
        <PublicHeaderMobileNav items={data.header.mobileMenu} onNavigate={() => setOpen(false)} />
        <PublicHeaderCta cta={data.header.cta} onClick={() => setOpen(false)} />
      </aside>
    </>
  );
}
