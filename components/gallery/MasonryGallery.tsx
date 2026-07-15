"use client";
import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { GalleryItemDTO } from "@/types/gallery";
import { Maximize2, Sparkles } from "lucide-react";
import clsx from "clsx";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

function GalleryGrid({ items }: { items: GalleryItemDTO[] }) {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") || "all";

  // Filter logic: match tag or categoryId
  const filteredItems =
    activeCategory === "all"
      ? items
      : items.filter(
          (item) =>
            item.tag?.toLowerCase() === activeCategory.toLowerCase() ||
            item.categoryId === activeCategory
        );

  return (
    <section className="bg-aera-bg pb-20">
      <Container>
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item, index) => {
              const isLarge = item.isHighlight;
              return (
                <motion.div
                  key={item.id || index}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className={clsx(
                    "group relative overflow-hidden rounded-[2rem] border border-aera-champagne/45 bg-aera-champagne/10 hover:shadow-luxury hover:border-aera-accent/30 transition-all duration-500",
                    {
                      "col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2": isLarge,
                      "aspect-square": !isLarge,
                    }
                  )}
                >
                  {/* Image container */}
                  <div className="relative w-full h-full">
                    <Image
                      src={normalizeMediaUrl(item.image)}
                      alt={item.imageAlt || item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Corner Zoom Icon for some images */}
                    {index % 3 === 0 && (
                      <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-white/70 backdrop-blur-sm flex items-center justify-center text-aera-ink opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <Maximize2 size={11} className="stroke-[2.5]" />
                      </div>
                    )}

                    {/* Highlight Badge */}
                    {isLarge && (
                      <div className="absolute top-4 left-4 bg-aera-accent text-aera-bg px-3 py-1 rounded-full text-[9px] font-bold tracking-widest uppercase flex items-center gap-1 shadow-sm">
                        <Sparkles size={10} />
                        <span>Featured Design</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-aera-ink/80 via-aera-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end text-left">
                      <h4 className="font-heading text-base md:text-lg font-normal text-aera-bg mb-1 leading-snug">
                        {item.title}
                      </h4>
                      {item.tag && (
                        <span className="font-sans text-[10px] text-aera-gold uppercase tracking-widest font-bold mb-4">
                          {item.tag}
                        </span>
                      )}

                      <a
                        href="/booking"
                        className="inline-flex items-center justify-center bg-aera-bg text-aera-ink hover:bg-aera-accent hover:text-white px-4 py-2 rounded-full text-[10px] font-bold tracking-wider uppercase transition-all duration-300 decoration-none w-fit"
                      >
                        View Design
                      </a>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-aera-muted italic font-sans text-xs">
            No designs found in this category.
          </div>
        )}
      </Container>
    </section>
  );
}

export function MasonryGallery({ items }: { items: GalleryItemDTO[] }) {
  return (
    <Suspense fallback={<div className="h-40" />}>
      <GalleryGrid items={items} />
    </Suspense>
  );
}
export default MasonryGallery;
