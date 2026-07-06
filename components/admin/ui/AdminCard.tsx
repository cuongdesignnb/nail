"use client";

import React, { forwardRef } from "react";
import clsx from "clsx";

export interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  children: React.ReactNode;
}

const paddingClasses: Record<string, string> = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

export const AdminCard = forwardRef<HTMLDivElement, AdminCardProps>(
  (
    {
      hover = false,
      padding = "md",
      children,
      className,
      onClick,
      ...props
    },
    ref
  ) => {
    const isInteractive = !!onClick || hover;

    return (
      <div
        ref={ref}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onClick={onClick}
        onKeyDown={
          onClick
            ? (e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onClick(e as unknown as React.MouseEvent<HTMLDivElement>);
                }
              }
            : undefined
        }
        className={clsx(
          "bg-[var(--admin-surface)] border border-[var(--admin-border)] rounded-[var(--admin-radius-lg)]",
          "shadow-[var(--admin-shadow-sm)]",
          paddingClasses[padding],
          isInteractive && [
            "transition-all duration-[var(--admin-transition-normal)]",
            "hover:shadow-[var(--admin-shadow-md)] hover:border-[var(--admin-border-strong)]",
            "hover:-translate-y-0.5",
            "cursor-pointer",
          ],
          onClick &&
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--admin-accent)]/40 focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AdminCard.displayName = "AdminCard";

export default AdminCard;
