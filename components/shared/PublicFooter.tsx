import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { getPublishedGlobalContent } from "@/lib/content/content.service";
import { business } from "@/lib/data";

export async function PublicFooter() {
  const global = await getPublishedGlobalContent();

  const brandName = global?.brand?.name || business.name;
  const brandText = global?.footer?.brandText || "Luxury nail care in an elegant lounge created for quiet beauty, expert detail and calm self-care.";
  
  const quickLinks = global?.footer?.quickLinks || [
    { id: "services", label: "Services", href: "/services" },
    { id: "packages", label: "Packages", href: "/packages" },
    { id: "gallery", label: "Gallery", href: "/gallery" },
    { id: "booking", label: "Booking", href: "/booking" }
  ];

  const contactPhone = global?.footer?.contact?.phone || business.phone;
  const contactEmail = global?.footer?.contact?.email || business.email;
  const contactAddress = global?.footer?.contact?.address || business.address;

  // Strip non-digits for raw phone link
  const rawPhone = contactPhone.replace(/\D/g, "");

  return (
    <footer>
      <div className="footer-brand">
        <h3>{brandName}</h3>
        <p>{brandText}</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>{link.label}</Link>
        ))}
      </div>
      <div>
        <h3>Contact</h3>
        <a href={`tel:+${rawPhone}`}><Phone size={14} /> {contactPhone}</a>
        <a href={`mailto:${contactEmail}`}><Mail size={14} /> {contactEmail}</a>
        <span><MapPin size={14} /> {contactAddress}</span>
      </div>
    </footer>
  );
}

