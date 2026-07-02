export type ImageConfig = {
  src: string;
  alt: string;
};

export type ButtonConfig = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type GalleryCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type GalleryCollectionDTO = {
  id: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  imageAlt?: string;
  designCount: number;
};

export type GalleryItemDTO = {
  id: string;
  categoryId?: string;
  title: string;
  slug: string;
  description?: string;
  image: string;
  imageAlt?: string;
  tag?: string;
  isHighlight?: boolean;
};

export type GalleryTrendDTO = {
  id: string;
  title: string;
  slug: string;
  image?: string;
  imageAlt?: string;
};

export type GalleryProcessStepDTO = {
  id: string;
  step: string;
  icon?: string;
  title: string;
  description: string;
};

export type GalleryTestimonialDTO = {
  id: string;
  name: string;
  avatar?: string;
  avatarAlt?: string;
  rating: number;
  quote: string;
};

export type GalleryPageContent = {
  seo: {
    title: string;
    description: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    image: ImageConfig;
    primaryButton: ButtonConfig;
    secondaryButton: ButtonConfig;
  };
  categories: GalleryCategoryDTO[];
  collections: GalleryCollectionDTO[];
  items: GalleryItemDTO[];
  whyChoose: {
    eyebrow: string;
    title: string;
    description: string;
    image: ImageConfig;
    features: {
      id: string;
      icon: string;
      title: string;
      description: string;
    }[];
  };
  trends: GalleryTrendDTO[];
  processSteps: GalleryProcessStepDTO[];
  testimonials: GalleryTestimonialDTO[];
  cta: {
    title: string;
    description: string;
    button: ButtonConfig;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
};
