"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface AdminStickyActionBarProps {
  children: React.ReactNode;
  visible?: boolean;
}

export const AdminStickyActionBar: React.FC<AdminStickyActionBarProps> = ({
  children,
  visible = true,
}) => {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--admin-border)] bg-white/80 backdrop-blur-xl shadow-luxury"
        >
          <div className="mx-auto flex max-w-[1600px] items-center justify-end gap-3 px-4 py-3 sm:px-6 lg:px-8">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminStickyActionBar;
