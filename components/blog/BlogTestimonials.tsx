"use client";
import React from "react";
import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

interface BlogTestimonialsProps {
  data: {
    title: string;
    items: {
      id: string;
      name: string;
      role?: string | null;
      avatar?: string | null;
      avatarAlt?: string | null;
      rating: number;
      quote: string;
    }[];
  };
}

export function BlogTestimonials({ data }: BlogTestimonialsProps) {
  return (
    <section className="bg-aera-cream/35 py-16 border-t border-b border-aera-champagne/30 text-left relative overflow-hidden">
      {/* Decorative large quotes watermark */}
      <div className="absolute right-10 bottom-5 text-[15rem] font-heading font-normal text-aera-champagne/20 select-none pointer-events-none leading-none">
        an
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-aera-accent uppercase">
            Reader Reviews
          </span>
          <h3 className="font-heading text-2xl md:text-3xl text-aera-ink font-normal">
            {data.title}
          </h3>
          <div className="w-12 h-0.5 bg-aera-accent/30 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.items.map((test, idx) => (
            <motion.div
              key={test.id}
              className="bg-white border border-aera-champagne/45 rounded-3xl p-6 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <div className="space-y-4">
                {/* Gold Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      size={12}
                      className={
                        sIdx < test.rating
                          ? "fill-aera-gold text-aera-gold"
                          : "text-aera-champagne/60"
                      }
                    />
                  ))}
                </div>

                <p className="font-sans text-xs italic text-aera-muted leading-relaxed relative">
                  &ldquo;{test.quote}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-3 border-t border-aera-champagne/15 pt-4 mt-6">
                {test.avatar ? (
                  <div className="relative w-9 h-9 rounded-full overflow-hidden border border-aera-champagne/50">
                    <Image src={normalizeMediaUrl(test.avatar)} alt={test.avatarAlt || test.name} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="w-9 h-9 rounded-full bg-aera-cream border border-aera-champagne/50 flex items-center justify-center">
                    <MessageSquare size={13} className="text-aera-accent" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-xs text-aera-ink">{test.name}</h4>
                  {test.role && <span className="text-[10px] text-aera-muted">{test.role}</span>}
                </div>
              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
export default BlogTestimonials;
