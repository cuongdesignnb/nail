import type { Metadata } from "next";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { business } from "@/lib/data";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("contact");
  return metadata;
}

export default async function ContactPage() {
  const seo = await resolveStaticPageSeo("contact");

  return (
    <PageShell eyebrow="Contact" title="Plan Your Visit" copy="Call, message or send a note to our reception team.">
      <PageStructuredData pathname="/contact" title={seo.title} includeGlobal />
      <section className="detail-layout">
        <div className="lux-card contact-form">
          <h3>Send a Message</h3>
          <form>
            <input placeholder="Name" />
            <input placeholder="Email" />
            <textarea placeholder="How can we help?" />
            <button className="primary-btn" type="submit">Send Message</button>
          </form>
        </div>
        <aside className="lux-card detail-panel">
          <p><Phone size={18} /> {business.phone}</p>
          <p><Mail size={18} /> {business.email}</p>
          <p><MapPin size={18} /> {business.address}</p>
          <p><MessageCircle size={18} /> WhatsApp available for quick booking questions.</p>
          <iframe title="Aera Nail Lounge map" src={`https://maps.google.com/maps?q=${encodeURIComponent(business.address)}&output=embed`} />
        </aside>
      </section>
    </PageShell>
  );
}
