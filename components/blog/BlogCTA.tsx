"use client";
import React from "react";
import Link from "next/link";
import { Phone, MapPin, Clock, Calendar, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { ButtonConfig } from "@/types/blog";

interface BlogCTAProps {
  data: {
    title: string;
    description: string;
    button: ButtonConfig;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
}

export function BlogCTA({ data }: BlogCTAProps) {
  return (
    <section className="bg-white py-16 text-left relative overflow-hidden border-t border-aera-champagne/20">
      {/* Decorative Ornaments */}
      <div className="absolute top-10 left-10 opacity-20 pointer-events-none">
        <Sparkles size={24} className="text-aera-accent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-aera-cream/35 border border-aera-champagne/45 rounded-[2.5rem] p-8 md:p-12 shadow-luxury grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-8 space-y-6">
            <span className="inline-flex items-center gap-1.5 text-[9px] font-bold tracking-widest text-aera-accent uppercase">
              <Sparkles size={10} className="fill-aera-accent" />
              <span>Stay Inspired</span>
            </span>
            
            <h3 className="font-heading text-2xl md:text-3xl lg:text-4xl text-aera-ink leading-tight font-normal">
              {data.title}
            </h3>
            
            <p className="font-sans text-xs md:text-sm text-aera-muted leading-relaxed max-w-xl">
              {data.description}
            </p>

            {/* Quick contact list */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-aera-muted">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-aera-champagne/50 flex items-center justify-center shrink-0">
                  <Phone size={13} className="text-aera-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-aera-ink text-[10px] uppercase tracking-wider">Phone</h4>
                  <p className="mt-0.5">{data.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-aera-champagne/50 flex items-center justify-center shrink-0">
                  <MapPin size={13} className="text-aera-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-aera-ink text-[10px] uppercase tracking-wider">Location</h4>
                  <p className="mt-0.5 leading-relaxed">{data.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-aera-champagne/50 flex items-center justify-center shrink-0">
                  <Clock size={13} className="text-aera-accent" />
                </div>
                <div>
                  <h4 className="font-bold text-aera-ink text-[10px] uppercase tracking-wider">Hours</h4>
                  <p className="mt-0.5">{data.hours}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Button Action */}
          <div className="lg:col-span-4 flex justify-start lg:justify-end">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href={data.button.href}
                className="inline-flex items-center gap-2 bg-aera-accent hover:bg-aera-accentHover text-white text-xs font-bold px-8 py-4 rounded-full shadow-md transition-all duration-300 decoration-none uppercase tracking-wider"
              >
                <Calendar size={14} />
                <span>{data.button.label}</span>
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
export default BlogCTA;
