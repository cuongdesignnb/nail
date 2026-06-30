import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { business } from "@/lib/data";

export function PublicFooter() {
  return (
    <footer>
      <div className="footer-brand">
        <h3>{business.name}</h3>
        <p>Luxury nail care in an elegant lounge created for quiet beauty, expert detail and calm self-care.</p>
      </div>
      <div>
        <h3>Quick Links</h3>
        <Link href="/services">Services</Link>
        <Link href="/packages">Packages</Link>
        <Link href="/gallery">Gallery</Link>
        <Link href="/booking">Booking</Link>
      </div>
      <div>
        <h3>Contact</h3>
        <a href={`tel:+${business.rawPhone}`}><Phone size={14} /> {business.phone}</a>
        <a href={`mailto:${business.email}`}><Mail size={14} /> {business.email}</a>
        <span><MapPin size={14} /> {business.address}</span>
      </div>
    </footer>
  );
}
