"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getIcon } from "@/lib/icons";
import clsx from "clsx";

interface AnimatedButtonProps {
  label: string;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: string;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset";
}

export function AnimatedButton({
  label,
  href,
  variant = "primary",
  icon,
  onClick,
  className,
  type = "button",
}: AnimatedButtonProps) {
  const IconComponent = icon ? getIcon(icon) : null;

  const btnClasses = clsx(
    "inline-flex items-center justify-center font-sans tracking-wider transition-all duration-300 rounded-full font-bold text-sm",
    {
      "primary-btn pulse-btn shadow-lg": variant === "primary",
      "secondary-btn border border-aera-accent/30 text-aera-accent hover:border-aera-accent": variant === "secondary",
      "text-aera-accent hover:text-aera-accentHover hover:underline bg-transparent px-4 py-2": variant === "ghost",
    },
    className
  );

  const content = (
    <>
      <span>{label}</span>
      {IconComponent && <IconComponent className="w-4 h-4 ml-1.5" />}
    </>
  );

  if (href) {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="inline-block"
      >
        <Link href={href} className={btnClasses}>
          {content}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      type={type}
      onClick={onClick}
      className={btnClasses}
    >
      {content}
    </motion.button>
  );
}
export default AnimatedButton;
