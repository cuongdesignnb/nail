"use client";
import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { BlogCategoryDTO } from "@/types/blog";
import { motion } from "framer-motion";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

interface BrowseByCategoryProps {
  categories: BlogCategoryDTO[];
}

export function BrowseByCategory({ categories }: BrowseByCategoryProps) {
  const router = useRouter();

  // Filter out the 'All' option for visual grid display
  const visualCats = categories.filter((c) => c.slug !== "all").slice(0, 6);

  const handleCategoryClick = (slug: string) => {
    router.push(`/blog?category=${slug}`);
  };

  // Fallback images array
  const defaultImages = [
    "/images/category-nail-care.jpg",
    "/images/category-trends.jpg",
    "/images/category-bridal.jpg",
    "/images/category-salon-tips.jpg",
    "/images/category-wellness.jpg",
    "/images/category-guides.jpg",
  ];

  return (
    <section className="bg-aera-cream/20 py-16 border-t border-b border-aera-champagne/30 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="text-[10px] font-bold tracking-widest text-aera-accent uppercase">
            Explore Journals
          </span>
          <h3 className="font-heading text-2xl md:text-3xl text-aera-ink font-normal">
            Browse by Category
          </h3>
          <div className="w-12 h-0.5 bg-aera-accent/30 mx-auto mt-2" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {visualCats.map((cat, idx) => {
            const fallbackImg = defaultImages[idx % defaultImages.length];
            return (
              <motion.div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 border border-aera-champagne/45 bg-white p-1.5 cursor-pointer flex flex-col justify-end"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
              >
                {/* Image panel */}
                <div className="relative w-full h-full rounded-[1.3rem] overflow-hidden bg-aera-cream">
                  <Image
                    src={normalizeMediaUrl(cat.image) || fallbackImg}
                    alt={cat.imageAlt || cat.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 15vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-[0.85] group-hover:brightness-[0.75]"
                  />
                  
                  {/* Text Overlays */}
                  <div className="absolute inset-0 p-4 flex flex-col justify-end text-left z-10">
                    <h4 className="font-heading text-sm text-white group-hover:text-aera-accent transition-colors font-semibold leading-tight">
                      {cat.name}
                    </h4>
                    <span className="text-[9px] text-white/80 font-medium block mt-1">
                      {cat.postCount ?? 0} Articles
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
export default BrowseByCategory;
