import Link from "next/link";
import { Check } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { packages, services } from "@/lib/data";

export default function PackagesPage() {
  return (
    <PageShell eyebrow="Packages" title="Popular Packages" copy="Compare curated care packages and continue directly to booking.">
      <section className="content-grid three">
        {packages.map((pkg) => (
          <article className={`lux-card package-card ${pkg.featured ? "popular" : ""}`} key={pkg.id}>
            {pkg.featured && <span className="badge">Most Popular</span>}
            <h3>{pkg.name}</h3>
            <p>{pkg.description}</p>
            <strong className="detail-price">${pkg.price}</strong>
            {pkg.serviceIds.map((id) => <p key={id}><Check size={15} /> {services.find((service) => service.id === id)?.name}</p>)}
            <Link className="primary-btn compact" href={`/booking?package=${pkg.id}`}>Book Package</Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
