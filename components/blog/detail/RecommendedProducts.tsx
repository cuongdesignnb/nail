"use client";
import React from "react";
import Image from "next/image";
import { Sparkles, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { BlogPostProduct } from "@/types/blog";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

interface RecommendedProductsProps {
  items?: BlogPostProduct[] | null;
}

export function RecommendedProducts({ items }: RecommendedProductsProps) {
  const fallbackProducts: BlogPostProduct[] = [
    {
      image: "/images/product-oil.jpg",
      name: "Cuticle Oil",
      description: "Nourish & strengthen for healthy cuticles.",
      shopUrl: "/booking"
    },
    {
      image: "/images/product-cream.jpg",
      name: "Hand Cream",
      description: "Deep hydration for soft hands.",
      shopUrl: "/booking"
    },
    {
      image: "/images/product-remover.jpg",
      name: "Non-Acetone Remover",
      description: "Gentle & effective nail polish removal.",
      shopUrl: "/booking"
    },
    {
      image: "/images/product-topcoat.jpg",
      name: "Protective Top Coat",
      description: "Seal & protect for longer wear.",
      shopUrl: "/booking"
    }
  ];

  const productsList = items && items.length > 0 ? items : fallbackProducts;

  return (
    <section className="bg-aera-cream/20 py-16 border-t border-b border-aera-champagne/30 text-left font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest text-aera-accent uppercase">
            <ShoppingBag size={11} />
            <span>Care Essentials</span>
          </span>
          <h3 className="font-heading text-2xl md:text-3xl text-aera-ink font-normal">
            Recommended Products & Care Essentials
          </h3>
          <div className="w-12 h-0.5 bg-aera-accent/30 mx-auto mt-2" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {productsList.map((product, idx) => (
            <motion.div
              key={idx}
              className="group bg-white border border-aera-champagne/45 rounded-3xl overflow-hidden shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.08 }}
            >
              {/* Image */}
              <div className="relative aspect-square bg-aera-cream/35 overflow-hidden flex items-center justify-center p-4">
                <div className="relative w-full h-full rounded-2xl overflow-hidden bg-white shadow-sm/5">
                  <Image
                    src={normalizeMediaUrl(product.image) || "/images/product-oil.jpg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>

              {/* Text */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-3">
                <div className="space-y-1">
                  <h4 className="font-bold text-xs text-aera-ink group-hover:text-aera-accent transition-colors">
                    {product.name}
                  </h4>
                  <p className="text-[10px] text-aera-muted leading-relaxed line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <a
                  href={product.shopUrl || "/booking"}
                  className="w-full inline-flex items-center justify-center bg-aera-cream hover:bg-aera-accent text-aera-ink hover:text-white border border-aera-champagne/70 py-2 rounded-xl text-[9px] font-bold tracking-wider uppercase transition-all duration-300 decoration-none"
                >
                  Shop Now
                </a>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
export default RecommendedProducts;
