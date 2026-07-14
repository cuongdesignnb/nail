import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowRight, Check, Clock3 } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { addons, services, technicians } from "@/lib/data";
import { buildEntityPageMetadata } from "@/lib/seo/seo.service";
import { buildAbsoluteUrl } from "@/lib/seo/site-url";
import { buildServiceSchema } from "@/lib/seo/schema/service.schema";
import { buildOfferSchema } from "@/lib/seo/schema/offer.schema";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) {
    return Promise.resolve({
      title: "Service Not Found",
      robots: "noindex,nofollow",
    });
  }
  return buildEntityPageMetadata({
    scopeKey: `service:${service.id}`,
    pageKey: "service",
    pathname: `/services/${service.slug}`,
    fallbackTitle: service.name,
    fallbackDescription: service.longDescription || service.description,
    fallbackImage: service.image,
    fallbackImageAlt: service.name,
  });
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const service = services.find((item) => item.slug === params.slug);
  if (!service) notFound();
  const settings = await getPublicSiteSettings();
  const availableTechs = technicians.filter((tech) => service.technicianIds.includes(tech.id));
  const url = buildAbsoluteUrl(`/services/${service.slug}`);
  const serviceSchema = buildServiceSchema({
    name: service.name,
    description: service.longDescription || service.description,
    image: service.image,
    url,
    providerName: settings.brand.name,
  });
  const offerSchema = buildOfferSchema({
    name: service.name,
    url,
    price: service.price,
    priceCurrency: settings.currency,
  });
  return (
    <PageShell eyebrow={service.category} title={service.name} copy={service.longDescription}>
      <PageStructuredData
        pathname={`/services/${service.slug}`}
        title={service.name}
        faqs={service.faqs}
        extraSchemas={[serviceSchema, offerSchema]}
      />
      <section className="detail-layout">
        <div className="detail-media"><Image src={service.image} alt={service.name} fill sizes="50vw" /></div>
        <aside className="lux-card detail-panel">
          <h3>Service Summary</h3>
          <p><Clock3 size={16} /> {service.duration} minutes</p>
          <p className="detail-price">{new Intl.NumberFormat("en-US", { style: "currency", currency: settings.currency }).format(service.price)}</p>
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
