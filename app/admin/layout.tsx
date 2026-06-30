import Link from "next/link";
import Image from "next/image";
import { Bell, CalendarDays, ClipboardList, Gem, Home, Inbox, LayoutDashboard, Package, Settings, Star, Users, Wrench } from "lucide-react";
import { business } from "@/lib/data";

const nav = [
  ["Dashboard", "/admin", LayoutDashboard],
  ["Bookings", "/admin/bookings", ClipboardList],
  ["Calendar", "/admin/calendar", CalendarDays],
  ["Customers", "/admin/customers", Users],
  ["Services", "/admin/services", Gem],
  ["Technicians", "/admin/technicians", Users],
  ["Packages", "/admin/packages", Package],
  ["Inventory", "/admin/inventory", Inbox],
  ["Promotions", "/admin/promotions", Star],
  ["Reviews", "/admin/reviews", Star],
  ["Reports", "/admin/reports", Home],
  ["Settings", "/admin/settings", Settings]
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <Link className="admin-logo" href="/admin">
          <Image src="/aera-mark.svg" alt="" width={52} height={52} />
          <span>{business.name}</span>
        </Link>
        <nav>
          {nav.map(([label, href, Icon]) => (
            <Link key={String(href)} href={String(href)}>
              <Icon size={18} /> {String(label)}
            </Link>
          ))}
        </nav>
        <div className="admin-promo">
          <Wrench size={20} />
          <b>Grow Your Business</b>
          <p>Enable campaigns, reviews and automated reminders.</p>
        </div>
        <div className="admin-plan">Current Plan <b>Salon Pro</b></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <input placeholder="Search bookings, clients, services..." />
          <span><Bell size={18} /><b>3</b></span>
          <span><Inbox size={18} /><b>5</b></span>
          <div className="admin-profile">Sophia</div>
        </header>
        {children}
      </section>
    </main>
  );
}
