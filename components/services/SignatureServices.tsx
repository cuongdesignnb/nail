"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/common/Container";
import { SectionHeading } from "@/components/common/SectionHeading";
import { AnimatedButton } from "@/components/common/AnimatedButton";
import { staggerContainer, fadeUp } from "@/components/common/FloatingOrnaments";
import { ServiceDTO } from "@/types/services";
import { Clock } from "lucide-react";

export function SignatureServices({ items }: { items: ServiceDTO[] }) {
  return (
    <section className="bg-aera-bg py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="AERA SIGNATURES"
          title="Our Signature Services"
          align="center"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
        >
          {items.map((service, index) => (
            <motion.div
              key={service.id || index}
              variants={fadeUp}
              className="group bg-aera-bg rounded-[2rem] overflow-hidden border border-aera-champagne/40 shadow-sm hover:shadow-luxury hover:border-aera-accent/30 transition-all duration-500 flex flex-col h-full"
            >
              {/* Image Block */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-aera-champagne/15">
                <Image
                  src={service.image || "/images/about-nail-detail.jpg"}
                  alt={service.imageAlt || service.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Float Duration Tag */}
                {service.durationLabel && (
                  <div className="absolute top-4 right-4 bg-aera-bg/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm text-[10px] font-bold text-aera-ink tracking-wider uppercase flex items-center gap-1 border border-aera-champagne/40">
                    <Clock size={11} className="text-aera-accent" />
                    <span>{service.durationLabel}</span>
                  </div>
                )}
              </div>

              {/* Text Body */}
              <div className="p-6 md:p-8 flex flex-col flex-grow justify-between">
                <div>
                  <div className="flex items-baseline justify-between mb-3 gap-2">
                    <h3 className="font-heading text-lg md:text-xl font-normal text-aera-ink leading-tight group-hover:text-aera-accent transition-colors duration-300">
                      {service.name}
                    </h3>
                    <span className="font-heading text-lg font-semibold text-aera-accent shrink-0">
                      {service.priceLabel || `$${service.price}`}
                    </span>
                  </div>

                  <p className="font-sans text-xs text-aera-muted mb-6 leading-relaxed line-clamp-3">
                    {service.description || service.shortDescription}
                  </p>

                  {/* Bullet features list */}
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 mb-8">
                      {service.features.map((feature, fIndex) => (
                        <li key={fIndex} className="flex items-center gap-2 font-sans text-[11px] text-aera-muted">
                          <span className="w-1.5 h-1.5 rounded-full bg-aera-accent/40 shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Call To Action */}
                <AnimatedButton
                  label="Book Now"
                  href="/booking"
                  variant="secondary"
                  className="w-full text-xs py-2.5 border-aera-accent/20 group-hover:bg-aera-accent group-hover:text-aera-bg group-hover:border-aera-accent transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
export default SignatureServices;
