"use client";

interface AdminSidebarFooterProps {
  collapsed: boolean;
}

export default function AdminSidebarFooter({
  collapsed,
}: AdminSidebarFooterProps) {
  if (collapsed) return null;

  return (
    <div className="admin-sidebar__footer">
      <p className="text-[10px] tracking-wide text-[var(--admin-muted)] text-center">
        © Aera Nail Lounge
      </p>
    </div>
  );
}
