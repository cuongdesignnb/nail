"use client";
import React from "react";
import { Container } from "@/components/common/Container";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { Sparkle, OvalLine } from "@/components/common/FloatingOrnaments";
import { ServicesPageContent } from "@/types/services";
import { Phone, MapPin, Clock, Mail } from "lucide-react";

export function ServicesCTA({ data }: { data: ServicesPageContent["cta"] }) {
  return (
    <section className="bg-aera-champagne/10 py-20 relative overflow-hidden">
      {/* Background Ornaments */}
      <Sparkle className="top-12 left-1/4" delay={0.3} />
      <Sparkle className="bottom-12 right-1/4" delay={1.7} />

      <Container className="max-w-[1100px] relative z-10">
        <div className="bg-aera-bg rounded-[3rem] border border-aera-champagne/50 shadow-luxury p-8 md:p-12 lg:p-16 text-center relative overflow-hidden">
          {/* Decorative frame */}
          <OvalLine className="w-[120%] h-[120%] -top-10 -left-[10%] stroke-aera-accent/[0.03] rotate-12" />

          <span className="font-sans text-[10px] font-bold text-aera-accent tracking-[0.2em] uppercase mb-4 block">
            INDULGE YOURSELF
          </span>

          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-normal text-aera-ink leading-tight mb-4 max-w-2xl mx-auto">
            {data.title}
          </h2>

          <p className="font-sans text-xs md:text-sm text-aera-muted max-w-xl mx-auto mb-10 leading-relaxed">
            {data.description}
          </p>

          <div className="flex flex-col items-center justify-center gap-6 mb-12">
            <AnimatedButton
              label={data.button.label}
              href={data.button.href}
              variant="primary"
              icon="calendar"
              className="px-8 py-3.5 text-base"
            />
            <span className="font-sans text-[11px] text-aera-muted italic">
              Walk-Ins Welcome!
            </span>
          </div>

          {/* Contact Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-10 border-t border-aera-champagne/50">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-aera-champagne/20 text-aera-accent flex items-center justify-center mb-3">
                <Phone size={14} />
              </div>
              <span className="font-sans text-[10px] font-bold text-aera-ink uppercase tracking-wider mb-1">
                Call Us
              </span>
              <a href={`tel:${data.phone}`} className="font-sans text-[11px] text-aera-muted hover:text-aera-accent transition-colors">
                {data.phone}
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-aera-champagne/20 text-aera-accent flex items-center justify-center mb-3">
                <Mail size={14} />
              </div>
              <span className="font-sans text-[10px] font-bold text-aera-ink uppercase tracking-wider mb-1">
                Email Us
              </span>
              <a href={`mailto:${data.email}`} className="font-sans text-[11px] text-aera-muted hover:text-aera-accent transition-colors">
                {data.email}
              </a>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-aera-champagne/20 text-aera-accent flex items-center justify-center mb-3">
                <MapPin size={14} />
              </div>
              <span className="font-sans text-[10px] font-bold text-aera-ink uppercase tracking-wider mb-1">
                Find Us
              </span>
              <span className="font-sans text-[11px] text-aera-muted max-w-[180px]">
                {data.address}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-aera-champagne/20 text-aera-accent flex items-center justify-center mb-3">
                <Clock size={14} />
              </div>
              <span className="font-sans text-[10px] font-bold text-aera-ink uppercase tracking-wider mb-1">
                Hours
              </span>
              <span className="font-sans text-[11px] text-aera-muted">
                {data.hours}
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
export default ServicesCTA;
