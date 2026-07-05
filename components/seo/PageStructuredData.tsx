import { JsonLd } from "./JsonLd";
import type { JsonLdObject } from "@/lib/seo/schema/schema.types";
import { buildGlobalSchemas, buildPageBreadcrumbSchema, buildVisibleFaqSchema } from "@/lib/seo/schema/schema.factory";
import { getSeoSiteSettings } from "@/lib/seo/seo.service";

export async function PageStructuredData({
  pathname,
  title,
  includeGlobal = false,
  faqs,
  extraSchemas = [],
}: {
  pathname: string;
  title: string;
  includeGlobal?: boolean;
  faqs?: { question: string; answer: string }[];
  extraSchemas?: Array<JsonLdObject | null | undefined>;
}) {
  const settings = await getSeoSiteSettings();
  const schemas: JsonLdObject[] = [];
  if (includeGlobal) schemas.push(...(await buildGlobalSchemas()));
  if (settings.enableBreadcrumbSchema && pathname !== "/") {
    const breadcrumb = buildPageBreadcrumbSchema(pathname, title);
    if (breadcrumb) schemas.push(breadcrumb);
  }
  if (settings.enableFaqSchema && faqs?.length) {
    const faq = buildVisibleFaqSchema(faqs);
    if (faq) schemas.push(faq);
  }
  schemas.push(...extraSchemas.filter((schema): schema is JsonLdObject => Boolean(schema)));
  return <JsonLd schema={schemas} />;
}

