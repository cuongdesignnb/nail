"use client";

import React from "react";
import type { LucideIcon } from "lucide-react";

export interface AdminSectionTitleProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
}

export const AdminSectionTitle: React.FC<AdminSectionTitleProps> = ({
  title,
  icon: Icon,
  description,
}) => {
  return (
    <div className="flex items-start gap-3 mb-4">
      {Icon && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-aera-champagne/50 mt-0.5">
          <Icon className="h-4 w-4 text-aera-accent" />
        </div>
      )}

      <div className="min-w-0">
        <h2 className="text-sm font-bold text-aera-ink tracking-wide">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-aera-muted leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default AdminSectionTitle;
