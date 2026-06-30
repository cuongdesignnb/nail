import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3 } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { services } from "@/lib/data";

export default function ServicesPage() {
  return (
    <PageShell eyebrow="Services" title="Luxury Nail Services" copy="Browse manicures, pedicures, gel, BIAB, nail art and spa treatments with transparent pricing and duration.">
      <section className="content-grid three">
        {services.map((service) => (
          <article className="lux-card media-card" key={service.id}>
            <div className="card-image"><Image src={service.image} alt={service.name} fill sizes="360px" /></div>
            <span>{service.category}</span>
            <h3>{service.name}</h3>
            <p>{service.description}</p>
            <div className="card-meta"><Clock3 size={15} /> {service.duration} min <b>${service.price}</b></div>
            <Link className="text-link" href={`/services/${service.slug}`}>View Details <ArrowRight size={15} /></Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
