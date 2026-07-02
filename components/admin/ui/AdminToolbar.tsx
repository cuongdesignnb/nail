"use client";

import React from "react";

export interface AdminToolbarProps {
  children: React.ReactNode;
}

export const AdminToolbar: React.FC<AdminToolbarProps> = ({ children }) => {
  return (
    <div className="flex items-center gap-3 border-b border-aera-champagne/30 pb-4 mb-5 flex-wrap">
      {children}
    </div>
  );
};

export default AdminToolbar;
