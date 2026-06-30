"use client";
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  className?: string;
  align?: "left" | "center" | "right";
  sparkle?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  className,
  align = "center",
  sparkle = true,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      className={clsx(
        "mb-10 md:mb-14",
        {
          "text-center": align === "center",
          "text-left": align === "left",
          "text-right": align === "right",
        },
        className
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] text-aera-accent uppercase mb-3 font-sans">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading font-normal text-3xl md:text-4xl lg:text-5xl text-aera-ink leading-tight relative inline-block">
        {title}
        {sparkle && (
          <span className="absolute -top-2 -right-5 text-aera-gold text-base md:text-lg animate-pulse">
            ✦
          </span>
        )}
      </h2>
    </motion.div>
  );
}
export default SectionHeading;
