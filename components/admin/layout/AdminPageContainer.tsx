"use client";

import { motion } from "framer-motion";

/* ────────────────────────────── Props ────────────────────────────── */
interface AdminPageContainerProps {
  children: React.ReactNode;
  animate?: boolean;
}

/* ────────────────────────────── Component ────────────────────────────── */
export default function AdminPageContainer({
  children,
  animate = true,
}: AdminPageContainerProps) {
  if (!animate) {
    return <div className="admin-page-container">{children}</div>;
  }

  return (
    <motion.div
      className="admin-page-container"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
