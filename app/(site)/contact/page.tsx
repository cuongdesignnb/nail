import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { business } from "@/lib/data";

export default function ContactPage() {
  return (
    <PageShell eyebrow="Contact" title="Plan Your Visit" copy="Call, message or send a note to our reception team.">
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
