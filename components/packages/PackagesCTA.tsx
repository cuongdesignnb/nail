"use client";
import React from "react";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { Phone, MapPin, Clock } from "lucide-react";
import { PackagesPageContent } from "@/types/packages";

export function PackagesCTA({ data }: { data: PackagesPageContent["cta"] }) {
  return (
    <section className="bg-aera-cream py-16 text-center border-t border-aera-champagne/30">
      <Container className="max-w-4xl">
        <span className="font-sans text-[10px] text-aera-accent tracking-widest uppercase font-bold mb-3 block">
          READY TO FIND YOUR PERFECT PACKAGE?
        </span>
        <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-normal text-aera-ink leading-tight mb-4">
          {data.title}
        </h2>
        <p className="font-sans text-xs sm:text-sm text-aera-muted max-w-xl mx-auto mb-10 leading-relaxed">
          {data.description}
        </p>

        {/* Action Button */}
        <div className="flex justify-center mb-12">
          <AnimatedButton
            label={data.button.label}
            href={data.button.href}
            variant="primary"
            icon="arrow"
          />
        </div>

        {/* Direct contact info bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 border-t border-aera-champagne/30 max-w-3xl mx-auto">
          {/* Phone */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-aera-accent/10 text-aera-accent flex items-center justify-center mb-3">
              <Phone size={14} />
            </div>
            <span className="font-sans text-[9px] text-aera-muted tracking-wider uppercase font-semibold mb-1">
              Phone
            </span>
            <a
              href={`tel:${data.phone.replace(/[^0-9+]/g, "")}`}
              className="font-sans text-xs text-aera-ink font-bold hover:text-aera-accent transition-colors decoration-none"
            >
              {data.phone}
            </a>
          </div>

          {/* Location */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-aera-accent/10 text-aera-accent flex items-center justify-center mb-3">
              <MapPin size={14} />
            </div>
            <span className="font-sans text-[9px] text-aera-muted tracking-wider uppercase font-semibold mb-1">
              Location
            </span>
            <span className="font-sans text-xs text-aera-ink font-medium leading-tight max-w-[200px]">
              {data.address}
            </span>
          </div>

          {/* Hours */}
          <div className="flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-full bg-aera-accent/10 text-aera-accent flex items-center justify-center mb-3">
              <Clock size={14} />
            </div>
            <span className="font-sans text-[9px] text-aera-muted tracking-wider uppercase font-semibold mb-1">
              Hours
            </span>
            <span className="font-sans text-xs text-aera-ink font-medium">
              {data.hours}
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}
export default PackagesCTA;
