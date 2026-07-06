"use client";

import AdminShell from "@/components/admin/layout/AdminShell";
import AdminToastProvider from "@/components/admin/ui/AdminToastProvider";

// Keep this default export as the composition point for the admin route layout.

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminToastProvider>
      <AdminShell>{children}</AdminShell>
    </AdminToastProvider>
  );
}
