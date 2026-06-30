"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, X, CalendarCheck } from "lucide-react";
import { AboutPageContent } from "@/types/about";
import clsx from "clsx";

interface HeaderProps {
  data: AboutPageContent["header"];
  activePath?: string;
}

export function Header({ data, activePath = "/about" }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const currentPath = pathname || activePath;

  return (
    <>
      <header className="site-header sticky top-0 w-full z-[99]">
        <button
          className="menu-button !block lg:!hidden"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <MenuIcon size={24} />}
        </button>

        <Link className="logo" href="/" aria-label={`${data.brandName} home`}>
          <Image
            src={data.logo.src === "/images/logo-aera.png" ? "/aera-mark.svg" : data.logo.src}
            alt={data.logo.alt}
            width={58}
            height={58}
            priority
            className="w-10 h-10 md:w-[58px] md:h-[58px] object-contain"
          />
          <span className="font-heading text-aera-accent">{data.brandName}</span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-8 justify-center">
          {data.navItems.map((item) => {
            const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx("font-sans font-bold text-sm tracking-wider uppercase py-2 transition-all duration-300 relative", {
                  "text-aera-accent active": isActive,
                  "text-aera-muted hover:text-aera-accent": !isActive,
                })}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link className="book-top inline-flex items-center" href={data.cta.href}>
          <CalendarCheck size={17} className="mr-1.5" />
          {data.cta.label}
        </Link>
      </header>

      {/* Mobile Drawer Menu Overlay */}
      <div
        className={clsx("drawer-overlay", { open: menuOpen })}
        onClick={() => setMenuOpen(false)}
      />

      {/* Mobile Drawer */}
      <aside className={clsx("drawer-menu", { open: menuOpen })}>
        <div className="drawer-header">
          <Link className="logo" href="/" onClick={() => setMenuOpen(false)}>
            <Image
              src={data.logo.src === "/images/logo-aera.png" ? "/aera-mark.svg" : data.logo.src}
              alt={data.logo.alt}
              width={42}
              height={42}
              className="object-contain"
            />
            <span className="font-heading text-sm">{data.brandName}</span>
          </Link>
          <button
            className="drawer-close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>
        <nav className="drawer-nav flex flex-col gap-2 mt-4">
          {data.navItems.map((item) => {
            const isActive = currentPath === item.href || (item.href !== "/" && currentPath.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={clsx("text-base font-bold py-3 px-4 rounded-lg transition-all duration-300", {
                  "bg-aera-champagne text-aera-accent": isActive,
                  "text-aera-muted hover:bg-aera-champagne/40": !isActive,
                })}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <Link
          className="primary-btn drawer-book mt-6 w-full flex items-center justify-center"
          href={data.cta.href}
          onClick={() => setMenuOpen(false)}
        >
          <CalendarCheck size={17} className="mr-1.5" />
          {data.cta.label}
        </Link>
      </aside>
    </>
  );
}
export default Header;
