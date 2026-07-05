import { Mail, MapPin, Phone } from "lucide-react";
import { getPublishedGlobalContent } from "@/lib/content/content.service";
import { business } from "@/lib/data";
import { getPublishedFooterMenus } from "@/lib/navigation/navigation.service";
import { PublicFooterLegalMenu, PublicFooterMenu, PublicFooterSocialMenu } from "@/components/public/navigation/PublicFooterMenu";

export async function PublicFooter() {
  const [global, footerMenus] = await Promise.all([
    getPublishedGlobalContent(),
    getPublishedFooterMenus(),
  ]);

  const brandName = global?.brand?.name || business.name;
  const brandText = global?.footer?.brandText || "Luxury nail care in an elegant lounge created for quiet beauty, expert detail and calm self-care.";

  const contactPhone = global?.footer?.contact?.phone || business.phone;
  const contactEmail = global?.footer?.contact?.email || business.email;
  const contactAddress = global?.footer?.contact?.address || business.address;

  // Strip non-digits for raw phone link
  const rawPhone = contactPhone.replace(/\D/g, "");

  return (
    <footer data-footer-layout={footerMenus.settings.footerLayout}>
      <div className="footer-brand">
        <h3>{brandName}</h3>
        <p>{brandText}</p>
        <PublicFooterSocialMenu items={footerMenus.socialMenu} />
      </div>
      <PublicFooterMenu title="Company" items={footerMenus.companyMenu} />
      <PublicFooterMenu title="Services" items={footerMenus.servicesMenu} />
      <PublicFooterMenu title="Explore" items={footerMenus.exploreMenu} />
      <div>
        <h3>Contact</h3>
        <a href={`tel:+${rawPhone}`}><Phone size={14} /> {contactPhone}</a>
        <a href={`mailto:${contactEmail}`}><Mail size={14} /> {contactEmail}</a>
        <span><MapPin size={14} /> {contactAddress}</span>
      </div>
      <div className="footer-bottom">
        <PublicFooterLegalMenu items={footerMenus.legalMenu} />
        <span>{global?.footer?.copyright || `© ${new Date().getFullYear()} ${brandName}. All rights reserved.`}</span>
      </div>
    </footer>
  );
}
