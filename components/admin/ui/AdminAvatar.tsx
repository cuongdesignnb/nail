"use client";

import React from "react";
import clsx from "clsx";

export interface AdminAvatarProps {
  src?: string | null;
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export const AdminAvatar: React.FC<AdminAvatarProps> = ({
  src,
  name = "",
  size = "md",
  className,
}) => {
  const initials = name ? getInitials(name) : "?";

  if (src) {
    return (
      <img
        src={src}
        alt={name || "Avatar"}
        className={clsx(
          "rounded-full object-cover shrink-0",
          "border border-[var(--admin-border)]",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      aria-label={name || "Avatar"}
      className={clsx(
        "inline-flex items-center justify-center rounded-full shrink-0",
        "bg-gradient-to-br from-[var(--admin-accent)] to-[var(--admin-accent-hover)]",
        "font-semibold text-white",
        "border border-white/20",
        sizeClasses[size],
        className
      )}
    >
      {initials}
    </div>
  );
};

export default AdminAvatar;
