"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { getIcon } from "@/lib/icons";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { ServiceCategoryDTO } from "@/types/services";

export function QuickServiceCategories({ items }: { items: ServiceCategoryDTO[] }) {
  return (
    <section className="bg-aera-champagne/10 py-16">
      <Container>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6"
        >
          {items.map((cat, index) => {
            const IconComponent = getIcon(cat.icon || "sparkles");
            return (
              <motion.a
                key={cat.id || index}
                href={`#cat-section-${cat.slug}`}
                variants={fadeUp}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group bg-aera-bg rounded-2xl p-6 text-center shadow-sm border border-aera-champagne/45 flex flex-col items-center justify-between min-h-[190px] hover:shadow-luxury hover:border-aera-accent/30 transition-all duration-300 decoration-none"
              >
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-aera-champagne/30 text-aera-accent flex items-center justify-center mb-4 group-hover:bg-aera-accent group-hover:text-aera-bg transition-colors duration-300">
                    <IconComponent size={20} className="stroke-[1.5]" />
                  </div>
                  <h3 className="font-heading text-base font-medium text-aera-ink mb-1 group-hover:text-aera-accent transition-colors">
                    {cat.name}
                  </h3>
                  <p className="font-sans text-[11px] text-aera-muted line-clamp-2 max-w-[120px] mx-auto">
                    {cat.description}
                  </p>
                </div>

                <div className="w-6 h-6 rounded-full bg-aera-champagne/20 text-aera-accent flex items-center justify-center mt-4 group-hover:bg-aera-accent group-hover:text-aera-bg transition-colors duration-300">
                  {/* Arrow Icon */}
                  {React.createElement(getIcon("arrow"), { size: 10, className: "stroke-[2]" })}
                </div>
              </motion.a>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
export default QuickServiceCategories;
