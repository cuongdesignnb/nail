import { Mail, MapPin, Phone } from "lucide-react";
import { BrandLogo } from "./BrandLogo";
import { PublicFooterMenu, PublicFooterLink } from "./PublicFooterMenu";
import { PublicFooterSocialLinks } from "./PublicFooterSocialLinks";
import type { PublicShellData } from "@/lib/site-shell/public-shell.types";

function phoneHref(phone?: string) {
  const raw = (phone || "").replace(/\D/g, "");
  return raw ? `tel:+${raw}` : undefined;
}

export function PublicFooter({ data }: { data: PublicShellData }) {
  const footer = data.footer;
  const contact = footer.contact;
  const legal = footer.legalMenu.filter((item) => item.isEnabled !== false);
  const copyright = footer.copyright || `© ${new Date().getFullYear()} ${data.brand.name}. All rights reserved.`;

  return (
    <footer className="aera-public-footer" data-footer-layout={footer.layout}>
      <div className="aera-public-footer__inner">
        <div className="aera-public-footer__brand">
          <BrandLogo brandName={data.brand.name} logo={data.brand.logo} size="footer" />
          {footer.brandText && <p>{footer.brandText}</p>}
          {footer.showSocial && <PublicFooterSocialLinks items={footer.socialMenu} />}
        </div>
        <PublicFooterMenu title="Company" items={footer.companyMenu} />
        <PublicFooterMenu title="Services" items={footer.servicesMenu} />
        <PublicFooterMenu title="Explore" items={footer.exploreMenu} />
        <div className="aera-public-footer__column">
          <h3>Contact</h3>
          <div className="aera-public-footer__contact">
            {contact?.phone && phoneHref(contact.phone) && <a href={phoneHref(contact.phone)}><Phone size={14} /> {contact.phone}</a>}
            {contact?.email && <a href={`mailto:${contact.email}`}><Mail size={14} /> {contact.email}</a>}
            {contact?.address && <span><MapPin size={14} /> {contact.address}</span>}
            {contact?.hours && <span>{contact.hours}</span>}
          </div>
          {footer.newsletter?.title && (
            <div className="aera-public-footer__newsletter">
              <h3>{footer.newsletter.title}</h3>
              {footer.newsletter.description && <p>{footer.newsletter.description}</p>}
            </div>
          )}
        </div>
        <div className="aera-public-footer__bottom">
          {legal.length > 0 && (
            <nav className="aera-public-footer__legal" aria-label="Legal links">
              {legal.map((item) => (
                <PublicFooterLink key={item.id} item={item} />
              ))}
            </nav>
          )}
          <span>{copyright}</span>
        </div>
      </div>
    </footer>
  );
}
