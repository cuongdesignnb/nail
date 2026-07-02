const siteUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

/**
 * Build JSON-LD for a NailSalon local business.
 */
export function buildLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'NailSalon',
    name: 'Aera Nail Lounge',
    url: siteUrl(),
    logo: `${siteUrl()}/aera-mark.svg`,
    image: `${siteUrl()}/og-image.jpg`,
    description:
      'Premium nail salon offering luxurious manicures, pedicures, nail art, and spa services in an elegant atmosphere.',
    telephone: '+1-555-0123',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Luxury Avenue',
      addressLocality: 'Beverly Hills',
      addressRegion: 'CA',
      postalCode: '90210',
      addressCountry: 'US',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.0736,
      longitude: -118.4004,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '18:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '17:00',
      },
    ],
    priceRange: '$$',
    sameAs: [],
  };
}

/**
 * Build BreadcrumbList JSON-LD.
 */
export function buildBreadcrumbJsonLd(
  items: { name: string; url: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Build Article JSON-LD for a blog post.
 */
export function buildArticleJsonLd(post: {
  title: string;
  description: string;
  image?: string;
  author?: string;
  datePublished: string;
  dateModified?: string;
  url: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    image: post.image || undefined,
    author: {
      '@type': 'Person',
      name: post.author || 'Aera Nail Lounge',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Aera Nail Lounge',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl()}/aera-mark.svg`,
      },
    },
    datePublished: post.datePublished,
    dateModified: post.dateModified || post.datePublished,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
  };
}

/**
 * Build FAQPage JSON-LD.
 */
export function buildFaqPageJsonLd(
  faqs: { question: string; answer: string }[],
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}
