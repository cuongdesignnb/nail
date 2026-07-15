import type { Metadata } from "next";
import Image from "next/image";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { PageShell } from "@/components/shared/PageShell";
import { PageStructuredData } from "@/components/seo/PageStructuredData";
import { getPublicSiteSettings } from "@/lib/settings/public-settings.service";
import { buildStaticPageMetadata, resolveStaticPageSeo } from "@/lib/seo/seo.service";
import { getPublishedContactPageContent } from "@/lib/content/content.service";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { metadata } = await buildStaticPageMetadata("contact");
  return metadata;
}

export default async function ContactPage() {
  const [seo, settings, content] = await Promise.all([
    resolveStaticPageSeo("contact"),
    getPublicSiteSettings(),
    getPublishedContactPageContent(),
  ]);
  const heroImage = normalizeMediaUrl(content.hero.image.src);

  return (
    <PageShell eyebrow={content.hero.eyebrow} title={`${content.hero.title} ${content.hero.highlight}`.trim()} copy={content.hero.description}>
      <PageStructuredData pathname="/contact" title={seo.title} includeGlobal />
      {heroImage && (
        <section className="relative mx-auto mb-8 aspect-[16/7] w-full max-w-6xl overflow-hidden rounded-[2rem]">
          <Image src={heroImage} alt={content.hero.image.alt} fill priority sizes="(max-width: 1200px) 100vw, 1200px" className="object-cover" />
        </section>
      )}
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
          <p><Phone size={18} /> <a href={`tel:${settings.contact.phoneE164}`}>{settings.contact.phone}</a></p>
          <p><Mail size={18} /> <a href={`mailto:${settings.contact.email}`}>{settings.contact.email}</a></p>
          <p><MapPin size={18} /> {settings.contact.address}</p>
          <p>{settings.businessHoursSummary}</p>
          <p><MessageCircle size={18} /> WhatsApp available for quick booking questions.</p>
          <iframe title={`${settings.brand.name} map`} src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.contact.address)}&output=embed`} />
        </aside>
      </section>
    </PageShell>
  );
}
