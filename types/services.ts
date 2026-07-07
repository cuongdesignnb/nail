export type ImageConfig = {
  src: string;
  alt: string;
};

export type ButtonConfig = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type ServiceCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  subcategories?: ServiceSubcategoryDTO[];
};

export type ServiceSubcategoryDTO = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description?: string;
  sortOrder?: number;
};

export type ServiceDTO = {
  id: string;
  categoryId?: string;
  subcategoryId?: string;
  subcategory?: ServiceSubcategoryDTO;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  price?: number | string;
  priceLabel?: string;
  durationMinutes?: number;
  durationLabel?: string;
  features: string[];
  isFeatured: boolean;
};

export type ServiceAddonDTO = {
  id: string;
  name: string;
  price?: number | string;
  priceLabel?: string;
  description?: string;
};

export type ServicePackageDTO = {
  id: string;
  name: string;
  subtitle?: string;
  price?: number | string;
  priceLabel?: string;
  badge?: string;
  features: string[];
  isPopular?: boolean;
};

export type ServiceFaqDTO = {
  id: string;
  question: string;
  answer: string;
};

export type ServiceGalleryItemDTO = {
  id: string;
  title?: string;
  image: string;
  imageAlt?: string;
  tag?: string;
};

export type ServicesPageContent = {
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
  categories: ServiceCategoryDTO[];
  subcategories?: ServiceSubcategoryDTO[];
  signatureServices: ServiceDTO[];
  whyChoose: {
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
  pricing: {
    categories: {
      id: string;
      title: string;
      items: {
        name: string;
        priceLabel: string;
      }[];
      sections?: {
        id: string;
        title: string;
        items: {
          name: string;
          priceLabel: string;
        }[];
      }[];
    }[];
  };
  process: {
    id: string;
    step: string;
    title: string;
    description: string;
    icon: string;
  }[];
  gallery: ServiceGalleryItemDTO[];
  packages: ServicePackageDTO[];
  addons: ServiceAddonDTO[];
  faqs: ServiceFaqDTO[];
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
