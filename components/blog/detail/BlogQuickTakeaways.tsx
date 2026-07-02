"use client";
import React from "react";
import { Check } from "lucide-react";

interface BlogQuickTakeawaysProps {
  items?: string[];
}

export function BlogQuickTakeaways({ items }: BlogQuickTakeawaysProps) {
  const defaultItems = [
    "Prep your nails properly for long-lasting results.",
    "Protect your manicure from daily damage.",
    "Hydrate nails & cuticles to prevent lifting.",
    "Avoid habits that cause chips & peeling.",
    "Follow a simple care routine every day."
  ];

  const list = items && items.length > 0 ? items : defaultItems;

  return (
    <div className="bg-aera-cream/35 border border-aera-champagne/80 rounded-[1.5rem] p-6 shadow-sm/5 relative overflow-hidden font-sans my-8">
      {/* Decorative rose layout */}
      <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none select-none w-28 h-28 border border-aera-accent/30 rounded-full flex items-center justify-center text-aera-accent italic text-[5rem]">
        an
      </div>

      <div className="relative z-10 space-y-4">
        <h4 className="font-heading text-xs font-bold text-aera-accent tracking-widest uppercase flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-aera-accent" />
          Quick Takeaways
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-aera-muted leading-relaxed text-left">
          {list.map((item, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <span className="w-4 h-4 rounded-full bg-aera-accent/15 border border-aera-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                <Check size={9} className="text-aera-accent" />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default BlogQuickTakeaways;
