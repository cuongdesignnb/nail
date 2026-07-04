"use client";

import { motion } from "framer-motion";
import type {
  ContentPageMeta,
  ContentRegistryItem,
  ContentPageKey,
} from "@/lib/content/content.types";
import { ContentPageCard } from "./ContentPageCard";

/* ------------------------------------------------------------------ */
/*  Animation                                                         */
/* ------------------------------------------------------------------ */

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" as const },
  },
};

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

type Props = {
  pages: ContentPageMeta[];
  registry: Record<ContentPageKey, ContentRegistryItem>;
};

export function ContentPageGrid({ pages, registry }: Props) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {pages.map((page) => {
        const reg = registry[page.key];
        if (!reg) return null;

        return (
          <motion.div key={page.key} variants={itemVariants}>
            <ContentPageCard meta={page} registry={reg} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
