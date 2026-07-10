import Image from "next/image";
import Link from "next/link";
import type { ImageField } from "@/lib/content/content.types";
import { normalizeMediaUrl } from "@/lib/media/resolve-media";

type BrandLogoProps = {
  brandName: string;
  logo: ImageField | null;
  size?: "header" | "mobile" | "footer";
  priority?: boolean;
  className?: string;
};

const logoSizes = {
  header: 54,
  mobile: 44,
  footer: 50,
};

export function BrandLogo({ brandName, logo, size = "header", priority = false, className = "" }: BrandLogoProps) {
  const dimension = logoSizes[size];
  const logoSrc = normalizeMediaUrl(logo?.src);
  return (
    <Link className={`aera-brand-logo aera-brand-logo--${size} ${className}`.trim()} href="/" aria-label={`${brandName} home`}>
      {logoSrc && (
        <Image
          src={logoSrc}
          alt={logo?.alt || brandName}
          width={dimension}
          height={dimension}
          priority={priority}
          unoptimized={logoSrc.endsWith(".svg")}
          className="aera-brand-logo__image"
        />
      )}
      <span className="aera-brand-logo__text">{brandName}</span>
    </Link>
  );
}
