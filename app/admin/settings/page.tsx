import { business } from "@/lib/data";
import Link from "next/link";

export default function AdminSettingsPage() {
  return (
    <div className="admin-page">
      <section className="admin-section-heading"><h1>Settings</h1><p>Salon information, policies, tax, deposit, notifications and integrations.</p></section>
      <section className="content-grid two">
        <article className="admin-card"><h3>Salon Information</h3><p>{business.name}</p><p>{business.email}</p><p>{business.phone}</p></article>
        <article className="admin-card"><h3>Booking Policies</h3><p>Deposit: {business.depositRate * 100}%</p><p>Tax: {business.taxRate * 100}%</p><p>Buffer: {business.bufferMinutes} minutes</p></article>
        <article className="admin-card"><h3>Integrations</h3><p>Stripe, Resend, Twilio and R2 are environment-ready adapters.</p></article>
        <article className="admin-card"><h3>Roles</h3><p>Owner, Manager, Receptionist, Technician and Customer.</p></article>
        <article className="admin-card website-content-card">
          <span>Website Content</span>
          <h3>About Page</h3>
          <p>Manage the content, images, SEO and call-to-action sections of the public About page.</p>
          <Link className="primary-btn" href="/admin/settings/about">Manage About Page</Link>
        </article>
      </section>
    </div>
  );
}
