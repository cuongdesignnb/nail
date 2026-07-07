"use client";
import React from "react";
import { motion } from "framer-motion";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { ServicesPageContent } from "@/types/services";

export function ServicePricingMatrix({ data }: { data: ServicesPageContent["pricing"] }) {
  return (
    <section className="bg-aera-bg py-20 relative">
      <Container>
        <SectionHeading
          eyebrow="PRICING MENU"
          title="Service Menu & Pricing"
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {data.categories.map((category, catIndex) => (
            <motion.div
              key={category.id || catIndex}
              variants={fadeUp}
              className="bg-aera-champagne/15 rounded-3xl p-6 md:p-8 border border-aera-champagne/40 shadow-sm flex flex-col h-full hover:shadow-luxury hover:border-aera-accent/20 transition-all duration-300"
            >
              {/* Category Title */}
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-aera-accent/10">
                <span className="text-aera-accent text-sm">*</span>
                <h3 className="font-heading text-lg font-medium text-aera-ink">
                  {category.title}
                </h3>
              </div>

              {/* Items List */}
              <div className="space-y-6 flex-grow">
                {category.sections?.map((section) => (
                  <div key={section.id}>
                    <h4 className="mb-3 font-sans text-[11px] font-bold uppercase tracking-wide text-aera-accent">
                      {section.title}
                    </h4>
                    <ul className="space-y-4">
                      {section.items.map((item, itemIndex) => (
                        <li key={`${section.id}-${itemIndex}`} className="flex flex-col gap-1">
                          <div className="flex items-end justify-between gap-2">
                            <span className="font-sans text-xs font-semibold text-aera-ink leading-tight">
                              {item.name}
                            </span>
                            <span className="flex-grow border-b border-dotted border-aera-muted/30 mx-1 mb-1" />
                            <span className="font-heading text-sm font-semibold text-aera-accent shrink-0">
                              {item.priceLabel}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <ul className="space-y-5">
                  {category.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex flex-col gap-1">
                      <div className="flex items-end justify-between gap-2">
                        <span className="font-sans text-xs font-semibold text-aera-ink leading-tight">
                          {item.name}
                        </span>
                        <span className="flex-grow border-b border-dotted border-aera-muted/30 mx-1 mb-1" />
                        <span className="font-heading text-sm font-semibold text-aera-accent shrink-0">
                          {item.priceLabel}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
export default ServicePricingMatrix;
