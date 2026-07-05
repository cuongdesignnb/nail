import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { addons, services, technicians } from "@/lib/data";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) notFound();
  const availableTechs = technicians.filter((tech) => service.technicianIds.includes(tech.id));
  return (
    <PageShell eyebrow={service.category} title={service.name} copy={service.longDescription}>
      <section className="detail-layout">
        <div className="detail-media"><Image src={service.image} alt={service.name} fill sizes="50vw" /></div>
        <aside className="lux-card detail-panel">
          <h3>Service Summary</h3>
          <p><Clock3 size={16} /> {service.duration} minutes</p>
          <p className="detail-price">${service.price}</p>
          <h4>Compatible Add-ons</h4>
          {addons.filter((addon) => service.addons.includes(addon.id)).map((addon) => (
            <p key={addon.id}><Check size={15} /> {addon.name} · ${addon.price}</p>
          ))}
          <h4>Available Technicians</h4>
          <p>{availableTechs.map((tech) => tech.name).join(", ")}</p>
          <Link className="primary-btn" href={`/booking?service=${service.id}`}>Book This Service <ArrowRight size={15} /></Link>
        </aside>
      </section>
      <section className="content-grid two">
        {service.faqs.map((faq) => (
          <article className="lux-card" key={faq.question}>
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
