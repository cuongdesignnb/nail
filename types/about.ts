export type ButtonConfig = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  icon?: string;
};

export type ImageConfig = {
  src: string;
  alt: string;
};

export type IconCard = {
  id: string;
  icon: string;
  title: string;
  description: string;
};

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  avatar: ImageConfig;
  socials?: {
    instagram?: string;
    facebook?: string;
    tiktok?: string;
  };
};

export type GalleryImage = {
  id: string;
  image: ImageConfig;
  title?: string;
};

export type ProcessStep = {
  id: string;
  step: string;
  icon: string;
  title: string;
  description: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role?: string;
  avatar?: ImageConfig;
  rating: number;
  quote: string;
};

export type ContactSnippet = {
  icon: string;
  label: string;
  value: string;
  href?: string;
};

export type AboutPageContent = {
  seo: {
    title: string;
    description: string;
  };
  header: {
    logo: ImageConfig;
    brandName: string;
    navItems: {
      label: string;
      href: string;
    }[];
    cta: ButtonConfig;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlightText: string;
    description: string;
    primaryButton: ButtonConfig;
    secondaryButton: ButtonConfig;
    image: ImageConfig;
    watermark?: string;
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    images: ImageConfig[];
    statCard: {
      value: string;
      label: string;
      icon: string;
    };
    highlights: IconCard[];
  };
  missionVisionValues: IconCard[];
  benefits: {
    eyebrow: string;
    items: IconCard[];
  };
  experts: {
    eyebrow: string;
    title: string;
    members: TeamMember[];
  };
  salonExperience: {
    eyebrow: string;
    images: GalleryImage[];
  };
  process: {
    eyebrow: string;
    steps: ProcessStep[];
  };
  testimonials: {
    eyebrow: string;
    items: Testimonial[];
  };
  cta: {
    title: string;
    description: string;
    button: ButtonConfig;
    contactSnippets: ContactSnippet[];
  };
  footer: {
    brandText: string;
    quickLinks: {
      label: string;
      href: string;
    }[];
    services: {
      label: string;
      href: string;
    }[];
    contact: ContactSnippet[];
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
    };
    copyright: string;
  };
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    backgroundColor?: string;
    textColor?: string;
  };
};
