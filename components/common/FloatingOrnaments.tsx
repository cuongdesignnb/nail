"use client";
import React from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

export const fadeLeft = {
  hidden: { opacity: 0, x: 36 },
  visible: { opacity: 1, x: 0 },
};

export const fadeRight = {
  hidden: { opacity: 0, x: -36 },
  visible: { opacity: 1, x: 0 },
};

export const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

export function Sparkle({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <motion.span
      initial={{ opacity: 0.2, scale: 0.8 }}
      animate={{
        opacity: [0.2, 0.9, 0.2],
        scale: [0.8, 1.2, 0.8],
        y: [0, -12, 0],
      }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
      className={clsx("absolute text-aera-gold/40 font-sans pointer-events-none select-none", className)}
    >
      ✦
    </motion.span>
  );
}

export function OvalLine({ className }: { className?: string }) {
  return (
    <div className={clsx("absolute pointer-events-none", className)}>
      <svg
        className="w-full h-full stroke-aera-accent/10 fill-none"
        viewBox="0 0 200 100"
        preserveAspectRatio="none"
      >
        <ellipse cx="100" cy="50" rx="98" ry="48" strokeWidth="0.5" />
      </svg>
    </div>
  );
}

export function Watermark({ text, className }: { text: string; className?: string }) {
  return (
    <div
      className={clsx(
        "absolute text-[16rem] md:text-[28rem] lg:text-[36rem] font-heading text-aera-accent/[0.02] uppercase pointer-events-none select-none font-normal leading-none",
        className
      )}
      style={{ letterSpacing: "-0.05em" }}
    >
      {text}
    </div>
  );
}
