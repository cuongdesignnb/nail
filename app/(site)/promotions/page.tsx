import Link from "next/link";
import { PageShell } from "@/components/shared/PageShell";
import { promotions } from "@/lib/data";

export default function PromotionsPage() {
  return (
    <PageShell eyebrow="Promotions" title="Current Offers" copy="Active promotions and first-visit rewards for eligible bookings.">
      <section className="content-grid two">
        {promotions.filter((promo) => promo.active).map((promo) => (
          <article className="lux-card offer-card" key={promo.id}>
            <span>{promo.code}</span>
            <h3>{promo.title}</h3>
            <p>Valid until {promo.validUntil}. {promo.firstBookingOnly ? "First booking only." : "Available for eligible guests."}</p>
            <Link className="primary-btn" href={`/booking?promo=${promo.code}`}>Use Offer</Link>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
