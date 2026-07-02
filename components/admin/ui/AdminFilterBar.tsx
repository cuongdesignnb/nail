"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

export interface AdminFilterBarProps {
  children: React.ReactNode;
  onReset?: () => void;
}

export const AdminFilterBar: React.FC<AdminFilterBarProps> = ({
  children,
  onReset,
}) => {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      {children}

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-aera-muted transition-colors hover:text-aera-ink hover:bg-aera-champagne/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aera-accent/40"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      )}
    </div>
  );
};

export default AdminFilterBar;
