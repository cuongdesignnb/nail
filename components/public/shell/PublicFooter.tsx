import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { PublicFooterLink, PublicFooterMenu } from "./PublicFooterMenu";
import { PublicFooterSocialLinks } from "./PublicFooterSocialLinks";
import type { PublicShellData } from "@/lib/site-shell/public-shell.types";
import styles from "./PublicFooter.module.css";

function phoneHref(phone?: string | null) {
  const raw = (phone || "").replace(/\D/g, "");
  return raw ? `tel:+${raw}` : undefined;
}

export function PublicFooter({ data }: { data: PublicShellData }) {
  const footer = data.footer;
  const contact = footer.contact;
  const legal = footer.legalMenu.filter((item) => item.isEnabled !== false);
  const copyright = footer.copyright || `© ${new Date().getFullYear()} ${data.brand.name}. All rights reserved.`;
  const phoneUrl = phoneHref(contact?.phone);

  return (
    <footer className={styles.footer} data-footer-layout={footer.layout} aria-label="Site footer">
      <div className={styles.inner}>
        <div className={styles.top}>
          <section className={styles.brandColumn} aria-label="Footer brand">
            <BrandLogo brandName={data.brand.name} logo={data.brand.logo} size="footer" />
            {footer.brandText && <p className={styles.brandText}>{footer.brandText}</p>}
            {footer.showSocial && <PublicFooterSocialLinks items={footer.socialMenu} />}
          </section>

          <PublicFooterMenu title="Company" items={footer.companyMenu} />
          <PublicFooterMenu title="Services" items={footer.servicesMenu} />
          <PublicFooterMenu title="Explore" items={footer.exploreMenu} />

          <section className={styles.contactColumn} aria-labelledby="footer-contact-heading">
            <h2 className={styles.heading} id="footer-contact-heading">Contact</h2>
            <div className={styles.contactList}>
              {contact?.phone && phoneUrl && (
                <a className={styles.contactItem} href={phoneUrl}>
                  <Phone size={16} />
                  <span>{contact.phone}</span>
                </a>
              )}
              {contact?.email && (
                <a className={styles.contactItem} href={`mailto:${contact.email}`}>
                  <Mail size={16} />
                  <span>{contact.email}</span>
                </a>
              )}
              {contact?.address && (
                <span className={styles.contactItem}>
                  <MapPin size={16} />
                  <span>{contact.address}</span>
                </span>
              )}
              {contact?.hours && (
                <span className={styles.contactItem}>
                  <Clock size={16} />
                  <span>{contact.hours}</span>
                </span>
              )}
            </div>

            {footer.newsletter?.title && (
              <div className={styles.newsletter}>
                <h2 className={styles.heading}>{footer.newsletter.title}</h2>
                {footer.newsletter.description && <p className={styles.newsletterText}>{footer.newsletter.description}</p>}
              </div>
            )}
          </section>
        </div>

        <div className={styles.bottom}>
          <span className={styles.copyright}>{copyright}</span>
          {legal.length > 0 && (
            <nav className={styles.legalLinks} aria-label="Legal links">
              {legal.map((item) => (
                <PublicFooterLink key={item.id} item={item} />
              ))}
            </nav>
          )}
        </div>
      </div>
    </footer>
  );
}
