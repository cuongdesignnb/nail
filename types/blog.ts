export type ImageConfig = {
  src: string;
  alt: string;
};

export type ButtonConfig = {
  label: string;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
};

export type BlogPostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";

export type BlogCategoryDTO = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  icon?: string | null;
  postCount?: number;
};

export type BlogPostFAQ = {
  question: string;
  answer: string;
};

export type BlogPostProduct = {
  image: string;
  name: string;
  description: string;
  shopUrl: string;
};

export type BlogPostDTO = {
  id: string;
  categoryId?: string | null;
  category?: BlogCategoryDTO | null;
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: string | null;
  coverImage?: string | null;
  coverImageAlt?: string | null;
  authorName?: string | null;
  authorAvatar?: string | null;
  authorRole?: string | null;
  readTimeMinutes?: number | null;
  status: BlogPostStatus;
  isFeatured?: boolean;
  isTrending?: boolean;
  isEditorsPick?: boolean;
  isPinned?: boolean;
  publishedAt?: string | null;
  scheduledAt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  seoKeywords?: string | null;
  faqs?: BlogPostFAQ[] | null;
  products?: BlogPostProduct[] | null;
  sortOrder?: number;
};

export type BlogPageContent = {
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
  categories: BlogCategoryDTO[];
  featuredPost?: BlogPostDTO;
  sideFeaturedPosts: BlogPostDTO[];
  latestPosts: BlogPostDTO[];
  popularCategories: BlogCategoryDTO[];
  trendingPosts: BlogPostDTO[];
  editorsPicks: BlogPostDTO[];
  testimonials: {
    title: string;
    items: {
      id: string;
      name: string;
      role?: string | null;
      avatar?: string | null;
      avatarAlt?: string | null;
      rating: number;
      quote: string;
    }[];
  };
  newsletter: {
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
  };
  cta: {
    title: string;
    description: string;
    button: ButtonConfig;
    phone: string;
    email: string;
    address: string;
    hours: string;
  };
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
