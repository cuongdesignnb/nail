"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AboutPageContent } from "@/types/about";
import { getIcon } from "@/lib/icons";
import { Facebook, Instagram, Mail, ArrowRight } from "lucide-react";

interface FooterProps {
  data: AboutPageContent["footer"];
  logo: AboutPageContent["header"]["logo"];
  brandName: string;
}

export function Footer({ data, logo, brandName }: FooterProps) {
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <footer className="!block !py-0 !px-0 border-t-0 bg-aera-champagne/30 text-left">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-24 pt-16 pb-8 border-t border-aera-accent/15">
        
        {/* 5-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-16">
          
          {/* Column 1: Brand Info */}
          <div className="flex flex-col gap-5 lg:col-span-1">
            <Link className="logo inline-flex items-center gap-3" href="/">
              <Image
                src={logo.src === "/images/logo-aera.png" ? "/aera-mark.svg" : logo.src}
                alt={logo.alt}
                width={50}
                height={50}
                className="object-contain shrink-0"
              />
              <span className="font-heading text-lg md:text-xl text-aera-accent font-semibold leading-none">{brandName}</span>
            </Link>
            <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed">
              {data.brandText}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-1">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-aera-accent/10 hover:bg-aera-accent text-aera-accent hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <Facebook size={14} />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-aera-accent/10 hover:bg-aera-accent text-aera-accent hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <Instagram size={14} />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-aera-accent/10 hover:bg-aera-accent text-aera-accent hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <span className="font-serif font-bold text-xs">P</span>
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-aera-accent/10 hover:bg-aera-accent text-aera-accent hover:text-white flex items-center justify-center transition-all duration-300"
              >
                <span className="font-serif font-bold text-[10px]">T</span>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="flex flex-col">
            <h3 className="font-heading text-sm md:text-base text-aera-ink font-semibold mb-5 uppercase tracking-wider relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-6 h-[1.5px] bg-aera-accent"></span>
            </h3>
            <ul className="flex flex-col gap-3 font-sans text-xs md:text-sm text-aera-muted">
              {data.quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-aera-accent hover:pl-1 transition-all duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="flex flex-col">
            <h3 className="font-heading text-sm md:text-base text-aera-ink font-semibold mb-5 uppercase tracking-wider relative inline-block">
              Services
              <span className="absolute -bottom-1 left-0 w-6 h-[1.5px] bg-aera-accent"></span>
            </h3>
            <ul className="flex flex-col gap-3 font-sans text-xs md:text-sm text-aera-muted">
              {data.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-aera-accent hover:pl-1 transition-all duration-300 block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="flex flex-col">
            <h3 className="font-heading text-sm md:text-base text-aera-ink font-semibold mb-5 uppercase tracking-wider relative inline-block">
              Contact
              <span className="absolute -bottom-1 left-0 w-6 h-[1.5px] bg-aera-accent"></span>
            </h3>
            <div className="flex flex-col gap-3 font-sans text-xs md:text-sm text-aera-muted">
              {data.contact.map((item, idx) => {
                const IconComp = getIcon(item.icon);
                return (
                  <div key={idx} className="flex items-start gap-2">
                    <IconComp size={14} className="text-aera-accent mt-0.5 shrink-0" />
                    {item.href ? (
                      <a href={item.href} className="hover:text-aera-accent transition-all duration-300">
                        {item.value}
                      </a>
                    ) : (
                      <span>{item.value}</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 5: Newsletter */}
          <div className="flex flex-col">
            <h3 className="font-heading text-sm md:text-base text-aera-ink font-semibold mb-5 uppercase tracking-wider relative inline-block">
              {data.newsletter.title}
              <span className="absolute -bottom-1 left-0 w-6 h-[1.5px] bg-aera-accent"></span>
            </h3>
            <p className="font-sans text-xs md:text-sm text-aera-muted mb-4 leading-relaxed">
              {data.newsletter.description}
            </p>
            <form onSubmit={handleNewsletterSubmit} className="relative">
              <input
                type="email"
                required
                placeholder={data.newsletter.placeholder}
                className="w-full bg-white border border-aera-accent/20 focus:border-aera-accent outline-none rounded-full py-2.5 pl-4 pr-11 text-xs text-aera-ink font-sans placeholder-aera-muted/55 transition-all duration-300"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="absolute right-1 top-1 bottom-1 bg-aera-accent hover:bg-aera-accentHover text-white rounded-full w-8 flex items-center justify-center transition-all duration-300 border-none cursor-pointer"
              >
                <ArrowRight size={14} />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Legal Bar */}
        <div className="border-t border-aera-accent/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-sans text-xs text-aera-muted">
          <p>{data.copyright}</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-aera-accent transition-all duration-300">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-aera-accent transition-all duration-300">
              Terms of Service
            </Link>
            <span>Designed with ♥ for luxury nail care</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
export default Footer;
