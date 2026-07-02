import { BlogPageContent } from "@/types/blog";

export const defaultBlogContent: BlogPageContent = {
  seo: {
    title: "Nail Beauty Journal | Aera Nail Lounge",
    description: "Discover expert tips, seasonal nail trends, self-care routines, and guides curated by Aera Nail Lounge specialists."
  },
  hero: {
    eyebrow: "NAIL BEAUTY JOURNAL",
    title: "Insights, Inspiration &",
    highlight: "Beauty Stories",
    description: "Discover expert tips, seasonal trends, and self-care guides curated for modern nail lovers by Aera specialists.",
    image: {
      src: "/images/blog-hero.jpg",
      alt: "Elegant nails and salon coffee table book styling"
    },
    primaryButton: {
      label: "Explore Articles",
      href: "#articles-list"
    },
    secondaryButton: {
      label: "Subscribe Now",
      href: "#newsletter-section"
    }
  },
  categories: [
    { id: "cat-all", name: "All", slug: "all" },
    { id: "cat-1", name: "Nail Care", slug: "nail-care", description: "Healthy habits for strong and glowing nails." },
    { id: "cat-2", name: "Trends", slug: "trends", description: "Seasonal colors, patterns, and shape directions." },
    { id: "cat-3", name: "Bridal", slug: "bridal", description: "Perfect wedding manicure prep and styling ideas." },
    { id: "cat-4", name: "Salon Tips", slug: "salon-tips", description: "Make the most of your salon visits and etiquette." },
    { id: "cat-5", name: "Wellness", slug: "wellness", description: "Self-care rituals and overall hand health." },
    { id: "cat-6", name: "Promotions", slug: "promotions", description: "Exclusive packages, discounts, and announcements." },
    { id: "cat-7", name: "Guides", slug: "guides", description: "Step-by-step tutorials and detailed advice." }
  ],
  featuredPost: {
    id: "post-featured",
    title: "How to Keep Your Gel Manicure Looking Fresh Longer",
    slug: "how-to-keep-gel-manicure-looking-fresh-longer",
    excerpt: "Expert-backed tips to extend the life of your gel manicure—without compromising shine, strength, or nail health.",
    coverImage: "/images/blog-featured.jpg",
    coverImageAlt: "Manicure details highlighting a fresh glossy finish",
    authorName: "Aera Team",
    authorAvatar: "/images/client-1.jpg",
    authorRole: "Nail Artist Specialist",
    readTimeMinutes: 5,
    status: "PUBLISHED",
    publishedAt: "2026-05-10T09:00:00.000Z",
    isFeatured: true
  },
  sideFeaturedPosts: [
    {
      id: "post-side-1",
      title: "Top Bridal Nail Trends for Elegant Weddings",
      slug: "top-bridal-nail-trends-elegant-weddings",
      excerpt: "Classic French variations, subtle glimmers, and sophisticated chrome tips for your wedding day.",
      coverImage: "/images/blog-side-1.jpg",
      coverImageAlt: "Bridal nails close-up detail",
      authorName: "Sophia C.",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      publishedAt: "2026-05-05T09:00:00.000Z"
    },
    {
      id: "post-side-2",
      title: "The Best Seasonal Shades for Autumn Glam",
      slug: "best-seasonal-shades-autumn-glam",
      excerpt: "Deep chocolate browns, warm copper hues, and forest green manicures to try this fall.",
      coverImage: "/images/blog-side-2.jpg",
      coverImageAlt: "Autumn nail colors display",
      authorName: "Sophia C.",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      publishedAt: "2026-04-28T09:00:00.000Z"
    }
  ],
  latestPosts: [
    {
      id: "post-1",
      title: "5 Signs Your Nails Need a Wellness Reset",
      slug: "5-signs-nails-need-wellness-reset",
      excerpt: "Learn the subtle signs your nails are trying to tell you—and how to restore their natural strength.",
      coverImage: "/images/blog-1.jpg",
      coverImageAlt: "Natural healthy nails styling detail",
      authorName: "Aera Team",
      authorAvatar: "/images/client-1.jpg",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      publishedAt: "2026-05-08T09:00:00.000Z"
    },
    {
      id: "post-2",
      title: "Minimal Nude Nails: A Timeless Luxury Look",
      slug: "minimal-nude-nails-timeless-luxury-look",
      excerpt: "Effortless, elegant, and always in style—discover why nude nails never go out of fashion.",
      coverImage: "/images/blog-2.jpg",
      coverImageAlt: "Nude nails manicure minimal setting",
      authorName: "Sophia C.",
      authorAvatar: "/images/client-2.jpg",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      publishedAt: "2026-05-03T09:00:00.000Z"
    },
    {
      id: "post-3",
      title: "Everything You Need to Know About Gel Polish",
      slug: "everything-you-need-to-know-about-gel-polish",
      excerpt: "From application to safe removal, here is your complete guide to long-lasting gel manicures.",
      coverImage: "/images/blog-3.jpg",
      coverImageAlt: "Gel polish application closeup",
      authorName: "Aera Team",
      authorAvatar: "/images/client-1.jpg",
      readTimeMinutes: 6,
      status: "PUBLISHED",
      publishedAt: "2026-04-26T09:00:00.000Z"
    },
    {
      id: "post-4",
      title: "Nail Care Routine for Stronger, Healthier Nails",
      slug: "nail-care-routine-stronger-healthier-nails",
      excerpt: "A simple daily routine that keeps your nails strong, shiny, and beautiful all year round.",
      coverImage: "/images/blog-4.jpg",
      coverImageAlt: "Moisturizing hand cream massage",
      authorName: "Sophia C.",
      authorAvatar: "/images/client-2.jpg",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      publishedAt: "2026-04-21T09:00:00.000Z"
    },
    {
      id: "post-5",
      title: "Nail Salon Etiquette: Do's & Don'ts",
      slug: "nail-salon-etiquette-dos-donts",
      excerpt: "A quick guide to help you enjoy the best salon experience—for you and everyone around you.",
      coverImage: "/images/blog-5.jpg",
      coverImageAlt: "Relaxed customer in premium nail salon lounge",
      authorName: "Aera Team",
      authorAvatar: "/images/client-1.jpg",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      publishedAt: "2026-05-09T09:00:00.000Z"
    },
    {
      id: "post-6",
      title: "Bridal Nail Care Timeline: Your Prep Guide",
      slug: "bridal-nail-care-timeline-prep-guide",
      excerpt: "When to start, what to do, and how to get picture-perfect nails for your wedding day.",
      coverImage: "/images/blog-6.jpg",
      coverImageAlt: "Ornate bridal nails with rings details",
      authorName: "Sophia C.",
      authorAvatar: "/images/client-2.jpg",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      publishedAt: "2026-04-15T09:00:00.000Z"
    },
    {
      id: "post-7",
      title: "The Perfect Nail Care Gifts for Every Occasion",
      slug: "perfect-nail-care-gifts-every-occasion",
      excerpt: "Thoughtful, luxurious, and always appreciated—our top-gift picks for nail lovers.",
      coverImage: "/images/blog-7.jpg",
      coverImageAlt: "Luxury gift boxes wrapping styling",
      authorName: "Aera Team",
      authorAvatar: "/images/client-1.jpg",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      publishedAt: "2026-04-10T09:00:00.000Z"
    },
    {
      id: "post-8",
      title: "How Your Nails Reflect Your Overall Health",
      slug: "how-your-nails-reflect-overall-health",
      excerpt: "What your nails can reveal about your body—and how to support your health from within.",
      coverImage: "/images/blog-8.jpg",
      coverImageAlt: "Manicure details highlighting clean nails",
      authorName: "Sophia C.",
      authorAvatar: "/images/client-2.jpg",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      publishedAt: "2026-04-05T09:00:00.000Z"
    }
  ],
  popularCategories: [
    { id: "cat-1", name: "Nail Care", slug: "nail-care", postCount: 18 },
    { id: "cat-2", name: "Trends", slug: "trends", postCount: 15 },
    { id: "cat-3", name: "Bridal", slug: "bridal", postCount: 12 },
    { id: "cat-4", name: "Salon Tips", slug: "salon-tips", postCount: 10 },
    { id: "cat-5", name: "Wellness", slug: "wellness", postCount: 9 },
    { id: "cat-7", name: "Guides", slug: "guides", postCount: 11 }
  ],
  trendingPosts: [
    { id: "post-featured", title: "How to Keep Your Gel Manicure Looking Fresh Longer", slug: "how-to-keep-gel-manicure-looking-fresh-longer", publishedAt: "2026-05-10T09:00:00.000Z", coverImage: "/images/blog-featured.jpg", status: "PUBLISHED" },
    { id: "post-2", title: "Minimal Nude Nails: A Timeless Luxury Look", slug: "minimal-nude-nails-timeless-luxury-look", publishedAt: "2026-05-03T09:00:00.000Z", coverImage: "/images/blog-2.jpg", status: "PUBLISHED" },
    { id: "post-side-1", title: "Top Bridal Nail Trends for Elegant Weddings", slug: "top-bridal-nail-trends-elegant-weddings", publishedAt: "2026-05-05T09:00:00.000Z", coverImage: "/images/blog-side-1.jpg", status: "PUBLISHED" }
  ],
  editorsPicks: [
    {
      id: "post-ep-1",
      title: "The Ultimate Guide to Long-Lasting Manicures",
      slug: "ultimate-guide-long-lasting-manicures",
      excerpt: "Get weeks of chip-free nails with these essential prep steps and professional maintenance habits.",
      coverImage: "/images/blog-editor-1.jpg",
      coverImageAlt: "Long lasting polished nails closeup",
      authorName: "Aera Team",
      readTimeMinutes: 6,
      status: "PUBLISHED",
      publishedAt: "2026-04-12T09:00:00.000Z",
      isEditorsPick: true
    },
    {
      id: "post-ep-2",
      title: "Luxury Nail Art Ideas for Special Occasions",
      slug: "luxury-nail-art-ideas-special-occasions",
      excerpt: "Sparkling accents, 3D elements, and delicate gold foils to make you shine at your next event.",
      coverImage: "/images/blog-editor-2.jpg",
      coverImageAlt: "Artistic nails detailing special design",
      authorName: "Sophia C.",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      publishedAt: "2026-04-02T09:00:00.000Z",
      isEditorsPick: true
    },
    {
      id: "post-ep-3",
      title: "Spring Nail Trends You'll Love in 2024",
      slug: "spring-nail-trends-love-2024",
      excerpt: "Pastel shades, floral details, and glazed donut nails are blooming this season.",
      coverImage: "/images/blog-editor-3.jpg",
      coverImageAlt: "Spring colors and floral details design",
      authorName: "Aera Team",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      publishedAt: "2026-03-28T09:00:00.000Z",
      isEditorsPick: true
    }
  ],
  testimonials: {
    title: "What Our Readers Say",
    items: [
      {
        id: "test-1",
        name: "Jessica R.",
        role: "Blog Reader",
        avatar: "/images/client-1.jpg",
        avatarAlt: "Jessica review profile",
        rating: 5,
        quote: "The articles are so informative and easy to follow. I've learned so much about nail care and feel more confident taking care of my nails at home!"
      },
      {
        id: "test-2",
        name: "Sophia L.",
        role: "Loyal Client",
        avatar: "/images/client-2.jpg",
        avatarAlt: "Sophia review profile",
        rating: 5,
        quote: "Aera's blog is my go-to for all things nails! The tips are practical, and the trends are always spot on. Absolutely love it!"
      },
      {
        id: "test-3",
        name: "Emily T.",
        role: "Blog Reader",
        avatar: "/images/client-3.jpg",
        avatarAlt: "Emily review profile",
        rating: 5,
        quote: "Beautiful content and expert advice every time. It's like having a nail pro in your pocket!"
      }
    ]
  },
  newsletter: {
    title: "Get Beauty Stories Straight to Your Inbox",
    description: "Subscribe to our newsletter for tips, trends & exclusive offers.",
    placeholder: "Enter your email",
    buttonLabel: "Subscribe Now"
  },
  cta: {
    title: "Stay Inspired with Aera Nail Lounge",
    description: "Book your next appointment and experience luxury nail care.",
    button: {
      label: "Book Your Appointment",
      href: "/booking"
    },
    phone: "(213) 555-1980",
    email: "hello@aeranaillounge.com",
    address: "123 Luxury Blvd, Suite 100, Los Angeles, CA 90001",
    hours: "Mon - Sun: 10:00 AM - 8:00 PM"
  },
  pagination: {
    page: 1,
    limit: 8,
    total: 8,
    totalPages: 1
  }
};
export default defaultBlogContent;
