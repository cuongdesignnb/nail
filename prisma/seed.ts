import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

async function main() {
  // 1. Admin user
  const password = await bcrypt.hash("AeraAdmin123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@aeranailounge.com" },
    update: {},
    create: {
      email: "admin@aeranailounge.com",
      name: "Sophia Tran",
      role: "Owner",
      password,
    },
  });

  // 2. Promotion WELCOME10
  await prisma.promotion.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      title: "10% Off Your First Visit",
      amount: 10,
      type: "percentage",
      active: true,
      validUntil: new Date("2026-12-31"),
    },
  });
  // 2.5 Technicians
  const technicianSeed = [
    { id: "tech-emily", name: "Emily Nguyen", role: "Nail Artist", specialty: "Gel X, minimal art", rating: 4.9, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85" },
    { id: "tech-sophia", name: "Sophia Tran", role: "Senior Nail Technician", specialty: "Pedicure, BIAB", rating: 4.8, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85" },
    { id: "tech-lily", name: "Lily Pham", role: "Nail Specialist", specialty: "Nail art, gel polish", rating: 4.9, avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85" },
    { id: "tech-maria", name: "Maria Lee", role: "Spa Technician", specialty: "Spa treatment, luxury pedicure", rating: 4.7, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=85" },
  ];
  for (const tech of technicianSeed) {
    await prisma.technician.upsert({
      where: { id: tech.id },
      update: {},
      create: { ...tech, rating: tech.rating, isActive: true },
    });
  }
  console.log("Seeded technicians:", technicianSeed.length);

  // 2.6 Reviews
  const reviewSeed = [
    { id: "review-1", customer: "Jessica M.", rating: 5, text: "The best nail salon experience. The staff is friendly, talented and incredibly detailed.", approved: true },
    { id: "review-2", customer: "Amanda R.", rating: 5, text: "Beautiful salon, clean tools and my gel set lasted perfectly.", approved: true },
    { id: "review-3", customer: "Kelly S.", rating: 4, text: "Calm, premium and very professional.", approved: true },
  ];
  for (const review of reviewSeed) {
    await prisma.review.upsert({
      where: { id: review.id },
      update: {},
      create: review,
    });
  }
  console.log("Seeded reviews:", reviewSeed.length);

  // 2.7 Inventory
  const inventorySeed = [
    { id: "inv-gel-polish", name: "Gel Polish", sku: "GEL-001", category: "Polish", unit: "bottle", currentStock: 8, reorderLevel: 10, supplier: "Aera Pro Supply", costPerUnit: 7.5 },
    { id: "inv-acrylic-powder", name: "Acrylic Powder", sku: "ACR-001", category: "Extensions", unit: "jar", currentStock: 3, reorderLevel: 5, supplier: "Aera Pro Supply", costPerUnit: 12.0 },
    { id: "inv-cuticle-oil", name: "Cuticle Oil", sku: "OIL-001", category: "Care", unit: "bottle", currentStock: 25, reorderLevel: 10, supplier: "Beauty Supply Co", costPerUnit: 4.5 },
    { id: "inv-nail-tips", name: "Nail Tips", sku: "TIP-001", category: "Extensions", unit: "box", currentStock: 2, reorderLevel: 5, supplier: "Aera Pro Supply", costPerUnit: 8.0 },
  ];
  for (const item of inventorySeed) {
    await prisma.inventoryItem.upsert({
      where: { sku: item.sku },
      update: {},
      create: { ...item, costPerUnit: item.costPerUnit, isActive: true },
    });
  }
  console.log("Seeded inventory items:", inventorySeed.length);

  // 3. Service Categories
  const categories = [
    { id: "cat-mani", name: "Manicure", slug: "manicure", description: "Nail shaping, cuticle care & hand treatment", icon: "hand", sortOrder: 0 },
    { id: "cat-pedi", name: "Pedicure", slug: "pedicure", description: "Foot soaking, exfoliation & nail care", icon: "flower", sortOrder: 1 },
    { id: "cat-gel", name: "Gel Polish", slug: "gel-polish", description: "Long-lasting color with brilliant shine", icon: "sparkles", sortOrder: 2 },
    { id: "cat-art", name: "Nail Art", slug: "nail-art", description: "Custom designs that express you", icon: "brush", sortOrder: 3 },
    { id: "cat-spa", name: "Spa Treatments", slug: "spa-treatments", description: "Rejuvenating rituals for hands & feet", icon: "leaf", sortOrder: 4 },
    { id: "cat-ext", name: "Extensions", slug: "extensions", description: "Strong, beautiful & long-lasting nails", icon: "gem", sortOrder: 5 },
  ];

  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
  }

  // 4. Services
  const services = [
    {
      id: "sig-mani",
      categoryId: "cat-mani",
      name: "Classic Manicure",
      slug: "classic-manicure",
      shortDescription: "Timeless care for clean, elegant hands.",
      description: "A refined everyday manicure with detailed shaping, cuticle care, hydration, hand massage and a flawless polish finish.",
      image: "/images/salon-experience-2.jpg",
      imageAlt: "Classic Manicure",
      price: 45,
      priceLabel: "$45",
      durationMinutes: 45,
      durationLabel: "45 min",
      features: ["Nail shaping & cuticle care", "Hand scrub & massage", "Polish of your choice"],
      isFeatured: true,
      sortOrder: 0,
    },
    {
      id: "sig-pedi",
      categoryId: "cat-pedi",
      name: "Luxury Pedicure",
      slug: "luxury-pedicure",
      shortDescription: "Nourishing spa ritual for tired feet.",
      description: "A complete foot-care experience with a warm foot soak, exfoliation, nourishing mask, hot towel, extended massage, and polish.",
      image: "/images/salon-experience-6.jpg",
      imageAlt: "Luxury Pedicure",
      price: 65,
      priceLabel: "$65",
      durationMinutes: 60,
      durationLabel: "60 min",
      features: ["Soak & exfoliation", "Callus removal", "Massage & polish"],
      isFeatured: true,
      sortOrder: 1,
    },
    {
      id: "sig-gel",
      categoryId: "cat-gel",
      name: "Gel Polish",
      slug: "gel-polish",
      shortDescription: "High-shine color that stays flawless.",
      description: "Durable gel polish applied with precision, cured under LED light for a glossy, chip-resistant finish that lasts 2-3 weeks.",
      image: "/images/about-nail-detail.jpg",
      imageAlt: "Gel Polish",
      price: 55,
      priceLabel: "$55",
      durationMinutes: 50,
      durationLabel: "50 min",
      features: ["Long-lasting gel color", "Chip-resistant finish", "Shine that lasts"],
      isFeatured: true,
      sortOrder: 2,
    },
    {
      id: "sig-art",
      categoryId: "cat-art",
      name: "Signature Nail Art",
      slug: "signature-nail-art",
      shortDescription: "Bespoke creative detail for your nails.",
      description: "Delicate details, minimal accents, chrome effects, or hand-painted patterns crafted by our expert nail artists to match your custom inspiration.",
      image: "/images/about-hero-nail.jpg",
      imageAlt: "Signature Nail Art",
      price: 15,
      priceLabel: "From $15",
      durationMinutes: 20,
      durationLabel: "20 min+",
      features: ["Custom hand-painted art", "Stones, chrome & more", "Designed just for you"],
      isFeatured: true,
      sortOrder: 3,
    },
    {
      id: "sig-spa",
      categoryId: "cat-spa",
      name: "Spa Hand & Foot Ritual",
      slug: "spa-hand-foot-ritual",
      shortDescription: "The ultimate skin softening treatment.",
      description: "Unwind with our botanical spa package focused on deep skin exfoliation, intense hydration masks, paraffin wrapping, and a soothing massage.",
      image: "/images/salon-experience-6.jpg",
      imageAlt: "Spa Hand & Foot Ritual",
      price: 75,
      priceLabel: "$75",
      durationMinutes: 70,
      durationLabel: "70 min",
      features: ["Deep cleansing & scrub", "Mask & massage", "Total relaxation"],
      isFeatured: true,
      sortOrder: 4,
    },
    {
      id: "sig-ext",
      categoryId: "cat-ext",
      name: "Gel X / Extensions",
      slug: "gel-x-extensions",
      shortDescription: "Strong, lightweight structural extensions.",
      description: "Flawless extensions molded precisely to your natural nail curves, delivering custom shape, length, and durability with a lightweight feel.",
      image: "/images/about-nail-detail.jpg",
      imageAlt: "Gel X Extensions",
      price: 80,
      priceLabel: "From $80",
      durationMinutes: 90,
      durationLabel: "90 min",
      features: ["Lightweight & durable", "Custom shape & length", "Includes gel color"],
      isFeatured: true,
      sortOrder: 5,
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {
        categoryId: s.categoryId,
        name: s.name,
        shortDescription: s.shortDescription,
        description: s.description,
        image: s.image,
        imageAlt: s.imageAlt,
        price: s.price,
        priceLabel: s.priceLabel,
        durationMinutes: s.durationMinutes,
        durationLabel: s.durationLabel,
        duration: s.durationMinutes, // legacy compat
        features: s.features,
        isFeatured: s.isFeatured,
        isActive: true,
        sortOrder: s.sortOrder,
        updatedAt: new Date(),
      },
      create: {
        id: s.id,
        categoryId: s.categoryId,
        name: s.name,
        slug: s.slug,
        shortDescription: s.shortDescription,
        description: s.description,
        image: s.image,
        imageAlt: s.imageAlt,
        price: s.price,
        priceLabel: s.priceLabel,
        durationMinutes: s.durationMinutes,
        durationLabel: s.durationLabel,
        duration: s.durationMinutes, // legacy compat
        features: s.features,
        isFeatured: s.isFeatured,
        isActive: true,
        sortOrder: s.sortOrder,
      },
    });
  }

  // 5. Addons
  const addons = [
    { id: "add-french", name: "French Tips", price: 15, priceLabel: "$15", description: "Classic white or colored tips", sortOrder: 0 },
    { id: "add-mass", name: "Hand Massage", price: 15, priceLabel: "$15", description: "Extended 15 min hot oil massage", sortOrder: 1 },
    { id: "add-rep", name: "Nail Repair", price: 10, priceLabel: "$10", description: "Silk wrap or builder gel fix per nail", sortOrder: 2 },
    { id: "add-rem", name: "Gel Removal", price: 10, priceLabel: "$10", description: "Safe steam soak and buff", sortOrder: 3 },
  ];

  for (const add of addons) {
    await prisma.serviceAddon.upsert({
      where: { id: add.id },
      update: {
        name: add.name,
        price: add.price,
        priceLabel: add.priceLabel,
        description: add.description,
        isActive: true,
        sortOrder: add.sortOrder,
        updatedAt: new Date(),
      },
      create: {
        id: add.id,
        name: add.name,
        price: add.price,
        priceLabel: add.priceLabel,
        description: add.description,
        isActive: true,
        sortOrder: add.sortOrder,
      },
    });
  }

  // 6. Packages
  const packages = [
    {
      id: "pkg-essential",
      name: "Essential Care",
      subtitle: "Perfect for regular maintenance",
      price: 65,
      priceLabel: "$65",
      badge: "Monthly",
      features: ["Classic Manicure", "Classic Pedicure", "Polish of choice", "Hand Massage"],
      isPopular: false,
      sortOrder: 0,
    },
    {
      id: "pkg-signature",
      name: "Signature Luxe",
      subtitle: "Our most loved experience",
      price: 95,
      priceLabel: "$95",
      badge: "Best Seller",
      features: ["Deluxe Manicure", "Luxury Pedicure", "Gel Polish Upgrade", "Paraffin Treatment", "Complimentary Drink"],
      isPopular: true,
      sortOrder: 1,
    },
    {
      id: "pkg-premium",
      name: "Premium Glam",
      subtitle: "Indulge in the ultimate luxury",
      price: 130,
      priceLabel: "$130",
      badge: "VIP Lounge",
      features: ["Spa Hand & Foot Ritual", "Gel X / Extensions", "Custom Nail Art", "Paraffin Treatment", "Complimentary Drink"],
      isPopular: false,
      sortOrder: 2,
    },
  ];

  for (const pkg of packages) {
    await prisma.servicePackage.upsert({
      where: { id: pkg.id },
      update: {
        name: pkg.name,
        subtitle: pkg.subtitle,
        price: pkg.price,
        priceLabel: pkg.priceLabel,
        badge: pkg.badge,
        features: pkg.features,
        isPopular: pkg.isPopular,
        isActive: true,
        sortOrder: pkg.sortOrder,
        updatedAt: new Date(),
      },
      create: {
        id: pkg.id,
        name: pkg.name,
        subtitle: pkg.subtitle,
        price: pkg.price,
        priceLabel: pkg.priceLabel,
        badge: pkg.badge,
        features: pkg.features,
        isPopular: pkg.isPopular,
        isActive: true,
        sortOrder: pkg.sortOrder,
      },
    });
  }

  // 7. FAQs
  const faqs = [
    {
      id: "faq-1",
      question: "How long do services take?",
      answer: "Manicures typically take 30-45 minutes. Pedicures take 45-60 minutes. Gel X or extensions with nail art can take up to 90-120 minutes. We always recommend arriving 5 minutes prior to your booking.",
      sortOrder: 0,
    },
    {
      id: "faq-2",
      question: "Do you accept walk-ins?",
      answer: "We prefer appointments to ensure you receive unhurried, personalized service. However, we do accept walk-ins if there is availability. You can book online instantly via our booking portal.",
      sortOrder: 1,
    },
    {
      id: "faq-3",
      question: "Are your tools sanitized?",
      answer: "Yes, hygiene is our highest priority. All metal tools are thoroughly scrubbed, sealed in sterilization pouches, and processed in a high-temperature autoclave sterilizer. All buffers, nail files, and foot scrub pads are 100% single-use and discarded after each client.",
      sortOrder: 2,
    },
    {
      id: "faq-4",
      question: "Can I request custom nail art?",
      answer: "Absolutely! Our technicians are highly trained nail artists. You can bring reference photos from Instagram, Pinterest, or your own sketches, and we will customize the shape, base color, lines, chrome, and crystal settings to fit your exact dream look.",
      sortOrder: 3,
    },
  ];

  for (const faq of faqs) {
    await prisma.serviceFaq.upsert({
      where: { id: faq.id },
      update: {
        question: faq.question,
        answer: faq.answer,
        isActive: true,
        sortOrder: faq.sortOrder,
        updatedAt: new Date(),
      },
      create: {
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        isActive: true,
        sortOrder: faq.sortOrder,
      },
    });
  }

  // 8. Gallery
  const gallery = [
    { id: "gal-1", title: "Soft pink gold line", image: "/images/salon-experience-2.jpg", tag: "Minimal", sortOrder: 0 },
    { id: "gal-2", title: "Champagne almond manicure", image: "/images/about-hero-nail.jpg", tag: "Elegant", sortOrder: 1 },
    { id: "gal-3", title: "Pearl glitter detail", image: "/images/about-nail-detail.jpg", tag: "Glitter", sortOrder: 2 },
    { id: "gal-4", title: "Wedding lace nail design", image: "/images/about-hero-nail.jpg", tag: "Bridal", sortOrder: 3 },
    { id: "gal-5", title: "Spring pastel flowers", image: "/images/salon-experience-2.jpg", tag: "Art", sortOrder: 4 },
    { id: "gal-6", title: "Glossy extensions", image: "/images/about-nail-detail.jpg", tag: "Elegant", sortOrder: 5 },
  ];

  for (const gal of gallery) {
    await prisma.serviceGalleryItem.upsert({
      where: { id: gal.id },
      update: {
        title: gal.title,
        image: gal.image,
        imageAlt: gal.title,
        tag: gal.tag,
        isActive: true,
        sortOrder: gal.sortOrder,
        updatedAt: new Date(),
      },
      create: {
        id: gal.id,
        title: gal.title,
        image: gal.image,
        imageAlt: gal.title,
        tag: gal.tag,
        isActive: true,
        sortOrder: gal.sortOrder,
      },
    });
  }

  // 9. Page Settings
  const settingsId = "services-settings-main";
  await prisma.servicesPageSetting.upsert({
    where: { id: settingsId },
    update: {
      heroEyebrow: "LUXURY NAIL SERVICES",
      heroTitle: "Exceptional Care for",
      heroHighlight: "Every Nail Style",
      heroDescription: "From timeless manicures to custom nail art, our premium services are designed to enhance your beauty in a relaxing, refined atmosphere. Tailored to you.",
      heroImage: "/images/about-hero-nail.jpg",
      heroImageAlt: "Luxury manicure with elegant nails",
      primaryButtonLabel: "Book Your Appointment",
      primaryButtonHref: "/booking",
      secondaryButtonLabel: "View Packages",
      secondaryButtonHref: "/packages",
      whyChooseTitle: "Beauty, Hygiene & Precision in Every Service",
      whyChooseDescription: "Your safety, comfort, and satisfaction are at the heart of everything we do. We use state-of-the-art tools and premium formulas to ensure the highest standards of nail lounge excellence.",
      whyChooseImage: "/images/about-salon.jpg",
      ctaTitle: "Ready for Your Perfect Nail Experience?",
      ctaDescription: "Treat yourself to the elegance, comfort, and care you deserve. We can't wait to pamper you at Aera Nail Lounge. Walk-ins welcome!",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(626) 555-7800",
      email: "hello@aeranailounge.com",
      address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
      hours: "Mon – Sun: 10:00 AM – 8:00 PM",
      seoTitle: "Luxury Nail Services | Aera Nail Lounge",
      seoDescription: "Experience premium manicure, pedicure, gel polish, nail art, and spa packages at Aera Nail Lounge.",
      updatedAt: new Date(),
    },
    create: {
      id: settingsId,
      heroEyebrow: "LUXURY NAIL SERVICES",
      heroTitle: "Exceptional Care for",
      heroHighlight: "Every Nail Style",
      heroDescription: "From timeless manicures to custom nail art, our premium services are designed to enhance your beauty in a relaxing, refined atmosphere. Tailored to you.",
      heroImage: "/images/about-hero-nail.jpg",
      heroImageAlt: "Luxury manicure with elegant nails",
      primaryButtonLabel: "Book Your Appointment",
      primaryButtonHref: "/booking",
      secondaryButtonLabel: "View Packages",
      secondaryButtonHref: "/packages",
      whyChooseTitle: "Beauty, Hygiene & Precision in Every Service",
      whyChooseDescription: "Your safety, comfort, and satisfaction are at the heart of everything we do. We use state-of-the-art tools and premium formulas to ensure the highest standards of nail lounge excellence.",
      whyChooseImage: "/images/about-salon.jpg",
      ctaTitle: "Ready for Your Perfect Nail Experience?",
      ctaDescription: "Treat yourself to the elegance, comfort, and care you deserve. We can't wait to pamper you at Aera Nail Lounge. Walk-ins welcome!",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(626) 555-7800",
      email: "hello@aeranailounge.com",
      address: "123 Luxe Ave, Suite 100, Los Angeles, CA 90001",
      hours: "Mon – Sun: 10:00 AM – 8:00 PM",
      seoTitle: "Luxury Nail Services | Aera Nail Lounge",
      seoDescription: "Experience premium manicure, pedicure, gel polish, nail art, and spa packages at Aera Nail Lounge.",
    },
  });

  // Preserve existing seeds (like defaultAboutContent)
  const aboutJsonPath = path.join(__dirname, "..", "data", "about.default.json");
  if (fs.existsSync(aboutJsonPath)) {
    const defaultAboutContent = JSON.parse(fs.readFileSync(aboutJsonPath, "utf8"));
    await prisma.sitePageContent.upsert({
      where: { slug: "about" },
      update: {},
      create: {
        slug: "about",
        draftContent: defaultAboutContent,
        publishedContent: defaultAboutContent,
        updatedBy: "seed",
        publishedBy: "seed",
        publishedAt: new Date(),
      },
    });
  }

  // ==========================================
  // Gallery Seeding
  // ==========================================
  console.log("Seeding Gallery Module...");

  // 1. Gallery Page Settings
  const gallerySettingsId = "gallery-settings-main";
  await prisma.galleryPageSetting.upsert({
    where: { id: gallerySettingsId },
    update: {
      seoTitle: "Luxury Nail Art Gallery | Aera Nail Lounge",
      seoDescription: "Explore our collection of elegant manicures, trend-driven custom nail art, bridal designs, and premium nail styles.",
      heroEyebrow: "NAIL ART GALLERY",
      heroTitle: "A World of Beauty,",
      heroHighlight: "Creativity & Shine",
      heroDescription: "Explore our curated collection of elegant manicures, trend-driven nail art, bridal styles, and luxurious salon moments designed to inspire your next visit.",
      heroImage: "/images/about-hero-nail.jpg",
      heroImageAlt: "Elegant manicured luxury nails",
      primaryButtonLabel: "Book Your Appointment",
      primaryButtonHref: "/booking",
      secondaryButtonLabel: "Explore Collections",
      secondaryButtonHref: "#collections",
      whyEyebrow: "WHY CLIENTS LOVE OUR DESIGNS",
      whyTitle: "Where Trend Meets Timeless Beauty",
      whyDescription: "Every set we create is a blend of creativity, precision, and care. From premium products to personalized service, we craft nail experiences that leave you feeling confident and radiant.",
      whyImage: "/images/about-salon.jpg",
      whyImageAlt: "Luxury Nail Lounge Interior",
      ctaTitle: "Ready to Find Your Next Nail Look?",
      ctaDescription: "Book your appointment today and let us bring your nail vision to life with luxury, care, and a touch of sparkle.",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(213) 555-1900",
      email: "hello@aeranailounge.com",
      address: "123 Luxury Blvd, Suite 100, Los Angeles, CA 90001",
      hours: "Mon – Sun: 10:00 AM – 8:00 PM",
      updatedAt: new Date(),
    },
    create: {
      id: gallerySettingsId,
      seoTitle: "Luxury Nail Art Gallery | Aera Nail Lounge",
      seoDescription: "Explore our collection of elegant manicures, trend-driven custom nail art, bridal designs, and premium nail styles.",
      heroEyebrow: "NAIL ART GALLERY",
      heroTitle: "A World of Beauty,",
      heroHighlight: "Creativity & Shine",
      heroDescription: "Explore our curated collection of elegant manicures, trend-driven nail art, bridal styles, and luxurious salon moments designed to inspire your next visit.",
      heroImage: "/images/about-hero-nail.jpg",
      heroImageAlt: "Elegant manicured luxury nails",
      primaryButtonLabel: "Book Your Appointment",
      primaryButtonHref: "/booking",
      secondaryButtonLabel: "Explore Collections",
      secondaryButtonHref: "#collections",
      whyEyebrow: "WHY CLIENTS LOVE OUR DESIGNS",
      whyTitle: "Where Trend Meets Timeless Beauty",
      whyDescription: "Every set we create is a blend of creativity, precision, and care. From premium products to personalized service, we craft nail experiences that leave you feeling confident and radiant.",
      whyImage: "/images/about-salon.jpg",
      whyImageAlt: "Luxury Nail Lounge Interior",
      ctaTitle: "Ready to Find Your Next Nail Look?",
      ctaDescription: "Book your appointment today and let us bring your nail vision to life with luxury, care, and a touch of sparkle.",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(213) 555-1900",
      email: "hello@aeranailounge.com",
      address: "123 Luxury Blvd, Suite 100, Los Angeles, CA 90001",
      hours: "Mon – Sun: 10:00 AM – 8:00 PM",
    },
  });

  // 2. Categories
  const categoriesData = [
    { id: "gcat-min", name: "Minimal", slug: "minimal", description: "Clean lines and subtle tones", sortOrder: 1 },
    { id: "gcat-ele", name: "Elegant", slug: "elegant", description: "Timeless classic aesthetics", sortOrder: 2 },
    { id: "gcat-gli", name: "Glitter", slug: "glitter", description: "Sparkle accents and metallic details", sortOrder: 3 },
    { id: "gcat-bri", name: "Bridal", slug: "bridal", description: "Delicate designs for your special day", sortOrder: 4 },
    { id: "gcat-flo", name: "Floral", slug: "floral", description: "Hand-painted botanical designs", sortOrder: 5 },
    { id: "gcat-fre", name: "French Tips", slug: "french-tips", description: "Modern twists on the classic French", sortOrder: 6 },
    { id: "gcat-art", name: "Art", slug: "art", description: "Bold patterns and custom hand-drawn concepts", sortOrder: 7 },
  ];

  for (const cat of categoriesData) {
    await prisma.galleryCategory.upsert({
      where: { id: cat.id },
      update: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
  }

  // 3. Collections
  const collectionsData = [
    { id: "gcol-1", title: "Minimal Nude", slug: "minimal-nude", description: "Clean nude tones with subtle accents", image: "/images/salon-experience-2.jpg", designCount: 12, sortOrder: 1 },
    { id: "gcol-2", title: "Chocolate Gloss", slug: "chocolate-gloss", description: "Rich brown colors with high-gloss finish", image: "/images/about-nail-detail.jpg", designCount: 18, sortOrder: 2 },
    { id: "gcol-3", title: "Bridal Glow", slug: "bridal-glow", description: "Soft pearlescents, whites, and gems", image: "/images/about-hero-nail.jpg", designCount: 16, sortOrder: 3 },
    { id: "gcol-4", title: "Floral Romance", slug: "floral-romance", description: "Delicate spring flowers and pastel bases", image: "/images/salon-experience-2.jpg", designCount: 14, sortOrder: 4 },
    { id: "gcol-5", title: "Golden Details", slug: "golden-details", description: "Metallic gold lines and foil accents", image: "/images/about-nail-detail.jpg", designCount: 15, sortOrder: 5 },
    { id: "gcol-6", title: "Soft Pink Elegance", slug: "soft-pink-elegance", description: "Timeless blushing pinks and neutral ombres", image: "/images/salon-experience-2.jpg", designCount: 13, sortOrder: 6 },
  ];

  for (const col of collectionsData) {
    await prisma.galleryCollection.upsert({
      where: { id: col.id },
      update: {
        title: col.title,
        slug: col.slug,
        description: col.description,
        image: col.image,
        imageAlt: col.title,
        designCount: col.designCount,
        sortOrder: col.sortOrder,
        isFeatured: true,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        id: col.id,
        title: col.title,
        slug: col.slug,
        description: col.description,
        image: col.image,
        imageAlt: col.title,
        designCount: col.designCount,
        sortOrder: col.sortOrder,
        isFeatured: true,
        isActive: true,
      },
    });
  }

  // 4. Gallery Items
  const itemsData = [
    { id: "gi-item-1", categoryId: "gcat-min", title: "Nude Gold Tips", slug: "nude-gold-tips", description: "Soft beige base with ultra-thin gold metallic French tips", image: "/images/salon-experience-2.jpg", tag: "Minimal", isHighlight: true, sortOrder: 1 },
    { id: "gi-item-2", categoryId: "gcat-ele", title: "Chocolate Gloss Nails", slug: "chocolate-gloss-nails", description: "Deep espresso and caramel tones finished with a glassy top coat", image: "/images/about-nail-detail.jpg", tag: "Elegant", isHighlight: false, sortOrder: 2 },
    { id: "gi-item-3", categoryId: "gcat-bri", title: "Bridal Pearl Nails", slug: "bridal-pearl-nails", description: "Milky white almond nails accented with tiny flatback pearls", image: "/images/about-hero-nail.jpg", tag: "Bridal", isHighlight: true, sortOrder: 3 },
    { id: "gi-item-4", categoryId: "gcat-flo", title: "Floral Romance", slug: "floral-romance-nails", description: "Detailed hand-painted cherry blossoms on a sheer pink base", image: "/images/salon-experience-2.jpg", tag: "Floral", isHighlight: false, sortOrder: 4 },
    { id: "gi-item-5", categoryId: "gcat-ele", title: "Golden Details", slug: "golden-details-nails", description: "Shimmering gold leaf flakes embedded inside clear builder gel", image: "/images/about-nail-detail.jpg", tag: "Elegant", isHighlight: true, sortOrder: 5 },
    { id: "gi-item-6", categoryId: "gcat-min", title: "Soft Pink Elegance", slug: "soft-pink-elegance-nails", description: "Classic semi-sheer baby pink manicure with a high-shine finish", image: "/images/salon-experience-2.jpg", tag: "Minimal", isHighlight: false, sortOrder: 6 },
    { id: "gi-item-7", categoryId: "gcat-gli", title: "Chrome Glow", slug: "chrome-glow", description: "Pearl glaze chrome rub-on powder over a neutral peach base", image: "/images/about-nail-detail.jpg", tag: "Glitter", isHighlight: false, sortOrder: 7 },
    { id: "gi-item-8", categoryId: "gcat-fre", title: "Glitter French", slug: "glitter-french", description: "Modern V-cut French tips featuring champagne glitter flakes", image: "/images/salon-experience-2.jpg", tag: "French Tips", isHighlight: false, sortOrder: 8 },
    { id: "gi-item-9", categoryId: "gcat-ele", title: "Cat Eye Brown", slug: "cat-eye-brown", description: "Magnetic velvet cat eye effect in warm amber-brown tones", image: "/images/about-nail-detail.jpg", tag: "Elegant", isHighlight: false, sortOrder: 9 },
    { id: "gi-item-10", categoryId: "gcat-bri", title: "Pearl Shine", slug: "pearl-shine", description: "Elegant bridal nails finished with an iridescent pearl sheen", image: "/images/about-hero-nail.jpg", tag: "Bridal", isHighlight: false, sortOrder: 10 },
    { id: "gi-item-11", categoryId: "gcat-min", title: "Minimal Nude", slug: "minimal-nude-item", description: "Sheer beige nude coffin nails with single tiny white dots", image: "/images/salon-experience-2.jpg", tag: "Minimal", isHighlight: false, sortOrder: 11 },
    { id: "gi-item-12", categoryId: "gcat-art", title: "3D Floral Art", slug: "3d-floral-art", description: "Custom sculpted 3D acrylic flower petals with gold bead centers", image: "/images/about-hero-nail.jpg", tag: "Art", isHighlight: true, sortOrder: 12 },
  ];

  for (const gi of itemsData) {
    await prisma.galleryItem.upsert({
      where: { id: gi.id },
      update: {
        categoryId: gi.categoryId,
        title: gi.title,
        slug: gi.slug,
        description: gi.description,
        image: gi.image,
        imageAlt: gi.title,
        tag: gi.tag,
        isHighlight: gi.isHighlight,
        isActive: true,
        sortOrder: gi.sortOrder,
        updatedAt: new Date(),
      },
      create: {
        id: gi.id,
        categoryId: gi.categoryId,
        title: gi.title,
        slug: gi.slug,
        description: gi.description,
        image: gi.image,
        imageAlt: gi.title,
        tag: gi.tag,
        isHighlight: gi.isHighlight,
        isActive: true,
        sortOrder: gi.sortOrder,
      },
    });
  }

  // 5. Trends
  const trendsData = [
    { id: "gt-1", title: "Chrome", slug: "chrome", image: "/images/about-nail-detail.jpg", sortOrder: 1 },
    { id: "gt-2", title: "Bridal", slug: "bridal", image: "/images/about-hero-nail.jpg", sortOrder: 2 },
    { id: "gt-3", title: "Minimal", slug: "minimal", image: "/images/salon-experience-2.jpg", sortOrder: 3 },
    { id: "gt-4", title: "Floral", slug: "floral", image: "/images/salon-experience-2.jpg", sortOrder: 4 },
    { id: "gt-5", title: "Cat Eye", slug: "cat-eye", image: "/images/about-nail-detail.jpg", sortOrder: 5 },
    { id: "gt-6", title: "Glossy Nude", slug: "glossy-nude", image: "/images/salon-experience-2.jpg", sortOrder: 6 },
  ];

  for (const tr of trendsData) {
    await prisma.galleryTrend.upsert({
      where: { id: tr.id },
      update: {
        title: tr.title,
        slug: tr.slug,
        image: tr.image,
        imageAlt: tr.title,
        sortOrder: tr.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        id: tr.id,
        title: tr.title,
        slug: tr.slug,
        image: tr.image,
        imageAlt: tr.title,
        sortOrder: tr.sortOrder,
        isActive: true,
      },
    });
  }

  // 6. Process Steps
  const stepsData = [
    { id: "gstep-1", step: "01", icon: "messages-square", title: "Consultation", description: "We listen to your ideas and recommend the perfect style for you.", sortOrder: 1 },
    { id: "gstep-2", step: "02", icon: "brush", title: "Design & Detail", description: "Our experts craft each detail with precision and artistic creativity.", sortOrder: 2 },
    { id: "gstep-3", step: "03", icon: "sparkles", title: "Final Glow", description: "We perfect every finish to ensure your nails shine with confidence and elegance.", sortOrder: 3 },
  ];

  for (const st of stepsData) {
    await prisma.galleryProcessStep.upsert({
      where: { id: st.id },
      update: {
        step: st.step,
        icon: st.icon,
        title: st.title,
        description: st.description,
        sortOrder: st.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        id: st.id,
        step: st.step,
        icon: st.icon,
        title: st.title,
        description: st.description,
        sortOrder: st.sortOrder,
        isActive: true,
      },
    });
  }

  // 7. Testimonials
  const testimonialsData = [
    { id: "gtest-1", name: "Jessica M.", avatar: "/images/client-1.jpg", rating: 5, quote: "Aera Nail Lounge never disappoints! The attention to detail, the cleanliness, and the designs are absolutely top-notch.", sortOrder: 1 },
    { id: "gtest-2", name: "Olivia T.", avatar: "/images/client-2.jpg", rating: 5, quote: "I love how creative and gentle the team is. My bridal nails were beyond perfect, and stayed flawless through every moment.", sortOrder: 2 },
    { id: "gtest-3", name: "Sophia C.", avatar: "/images/client-1.jpg", rating: 5, quote: "The most relaxing nail experience! The staff is friendly, professional, and always helps me find the perfect nail inspirations.", sortOrder: 3 },
  ];

  for (const t of testimonialsData) {
    await prisma.galleryTestimonial.upsert({
      where: { id: t.id },
      update: {
        name: t.name,
        avatar: t.avatar,
        avatarAlt: t.name,
        rating: t.rating,
        quote: t.quote,
        sortOrder: t.sortOrder,
        isActive: true,
        updatedAt: new Date(),
      },
      create: {
        id: t.id,
        name: t.name,
        avatar: t.avatar,
        avatarAlt: t.name,
        rating: t.rating,
        quote: t.quote,
        sortOrder: t.sortOrder,
        isActive: true,
      },
    });
  }

  // === Packages Module Seeds ===
  console.log("Seeding Packages Module...");
  
  // 1. Package Page Settings
  await prisma.packagePageSetting.upsert({
    where: { id: "pkg-settings" },
    update: {
      seoTitle: "Luxury Nail Packages & Memberships | Aera Nail Lounge",
      seoDescription: "Discover curated self-care, bridal, seasonal, and monthly membership packages designed for maximum pampering and savings.",
      heroEyebrow: "LUXURY NAIL PACKAGES",
      heroTitle: "Curated Packages for",
      heroHighlight: "Every Beauty Ritual",
      heroDescription: "Thoughtfully designed packages for every moment—whether it’s self-care, bridal beauty, regular maintenance, or an indulgent treat. Experience more value, more care, and more reasons to glow.",
      heroImage: "/images/about-hero-nail.jpg",
      heroImageAlt: "Luxury pampering session Aera Nail Lounge",
      primaryButtonLabel: "Book Your Package",
      primaryButtonHref: "/booking",
      secondaryButtonLabel: "Explore Perks",
      secondaryButtonHref: "#benefits",
      benefitsEyebrow: "WHY CHOOSE OUR PACKAGES",
      benefitsTitle: "Luxury, Value & Personalized Care in Every Package",
      benefitsDescription: "Our packages combine premium products, expert care, and exclusive perks—so you get more beauty and more value.",
      benefitsImage: "/images/about-salon.jpg",
      benefitsImageAlt: "Luxury salon interior and manicure stations",
      benefitsButtonLabel: "Learn More About Membership",
      benefitsButtonHref: "/about",
      comparisonTitle: "Compare Our Packages",
      rewardsTitle: "Membership & Rewards",
      occasionsTitle: "Perfect For Every Occasion",
      processTitle: "How It Works",
      testimonialsTitle: "What Clients Love",
      faqTitle: "Frequently Asked Questions",
      ctaTitle: "Ready to Find Your Perfect Package?",
      ctaDescription: "Indulge in luxury, save more, and let us take care of you.",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(213) 555-1900",
      email: "hello@aeranailounge.com",
      address: "123 Luxury Blvd, Suite 100, Los Angeles, CA 90001",
      hours: "Mon – Sun: 10:00 AM – 8:00 PM",
    },
    create: {
      id: "pkg-settings",
      seoTitle: "Luxury Nail Packages & Memberships | Aera Nail Lounge",
      seoDescription: "Discover curated self-care, bridal, seasonal, and monthly membership packages designed for maximum pampering and savings.",
      heroEyebrow: "LUXURY NAIL PACKAGES",
      heroTitle: "Curated Packages for",
      heroHighlight: "Every Beauty Ritual",
      heroDescription: "Thoughtfully designed packages for every moment—whether it’s self-care, bridal beauty, regular maintenance, or an indulgent treat. Experience more value, more care, and more reasons to glow.",
      heroImage: "/images/about-hero-nail.jpg",
      heroImageAlt: "Luxury pampering session Aera Nail Lounge",
      primaryButtonLabel: "Book Your Package",
      primaryButtonHref: "/booking",
      secondaryButtonLabel: "Explore Perks",
      secondaryButtonHref: "#benefits",
      benefitsEyebrow: "WHY CHOOSE OUR PACKAGES",
      benefitsTitle: "Luxury, Value & Personalized Care in Every Package",
      benefitsDescription: "Our packages combine premium products, expert care, and exclusive perks—so you get more beauty and more value.",
      benefitsImage: "/images/about-salon.jpg",
      benefitsImageAlt: "Luxury salon interior and manicure stations",
      benefitsButtonLabel: "Learn More About Membership",
      benefitsButtonHref: "/about",
      comparisonTitle: "Compare Our Packages",
      rewardsTitle: "Membership & Rewards",
      occasionsTitle: "Perfect For Every Occasion",
      processTitle: "How It Works",
      testimonialsTitle: "What Clients Love",
      faqTitle: "Frequently Asked Questions",
      ctaTitle: "Ready to Find Your Perfect Package?",
      ctaDescription: "Indulge in luxury, save more, and let us take care of you.",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(213) 555-1900",
      email: "hello@aeranailounge.com",
      address: "123 Luxury Blvd, Suite 100, Los Angeles, CA 90001",
      hours: "Mon – Sun: 10:00 AM – 8:00 PM",
    },
  });

  // 2. Package Categories
  const pkgCategories = [
    { id: "pcat-sig", name: "Signature", slug: "signature", description: "Timeless classic and deluxe combos", sortOrder: 1 },
    { id: "pcat-mem", name: "Membership", slug: "membership", description: "Loyalty visit plans and monthly packages", sortOrder: 2 },
    { id: "pcat-bri", name: "Bridal", slug: "bridal", description: "Elegant wedding beauty packages", sortOrder: 3 },
    { id: "pcat-sea", name: "Seasonal", slug: "seasonal", description: "Limited time beauty offerings", sortOrder: 4 },
    { id: "pcat-gif", name: "Gift Sets", slug: "gift-sets", description: "Perfect bundles to pamper someone special", sortOrder: 5 },
    { id: "pcat-vip", name: "VIP", slug: "vip", description: "Ultimate ultra-luxurious pampering rituals", sortOrder: 6 },
  ];

  for (const cat of pkgCategories) {
    await prisma.packageCategory.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: cat.sortOrder,
        isActive: true,
      },
    });
  }

  // 3. Nail Packages
  const nailPackages = [
    {
      id: "np-1",
      categoryId: "pcat-sig",
      name: "Essential Care",
      slug: "essential-care",
      subtitle: "Daily Refresh Ritual",
      shortDescription: "Essential manicure & pedicure maintenance combo.",
      description: "Keep your nails healthy and polished. Includes standard shaping, cuticle trimming, light buffing, and classic polish of choice.",
      price: 65,
      priceLabel: "$65",
      durationLabel: "60 mins",
      features: ["Classic Manicure", "Nail Shaping & Buffing", "Cuticle Care", "Regular Polish"],
      isPopular: false,
      isFeatured: true,
      image: "/images/salon-experience-2.jpg",
      sortOrder: 1,
    },
    {
      id: "np-2",
      categoryId: "pcat-sig",
      name: "Signature Luxe",
      slug: "signature-luxe",
      subtitle: "Our Ultimate Bestseller",
      shortDescription: "Deluxe manicure & pedicure with extended massage.",
      description: "Our signature service combination offering elevated cuticle prep, exfoliation sugar scrub, hydrating hand massage, and long-lasting gel polish.",
      price: 95,
      priceLabel: "$95",
      durationLabel: "75 mins",
      badge: "MOST POPULAR",
      features: ["Gel Manicure", "Cuticle Care", "Hand Massage", "One Accent Nail"],
      isPopular: true,
      isFeatured: true,
      image: "/images/about-nail-detail.jpg",
      sortOrder: 2,
    },
    {
      id: "np-3",
      categoryId: "pcat-sig",
      name: "Premium Glam",
      slug: "premium-glam",
      subtitle: "Paraffin Soft Treatment",
      shortDescription: "Manicure, pedicure, custom art credit & paraffin treatment.",
      description: "An intensive moisturizing and polishing experience. Includes a warm paraffin wax wrap, full gel overlay, and nail art custom detailing.",
      price: 130,
      priceLabel: "$130",
      durationLabel: "90 mins",
      features: ["Gel Manicure", "Nail Art Credit ($15)", "Paraffin Treatment", "Hand & Arm Massage"],
      isPopular: false,
      isFeatured: true,
      image: "/images/salon-experience-2.jpg",
      sortOrder: 3,
    },
    {
      id: "np-4",
      categoryId: "pcat-bri",
      name: "Bridal Beauty Set",
      slug: "bridal-beauty-set",
      subtitle: "For Your Wedding Day Glow",
      shortDescription: "Bridal prep manicure, pedicure, and paraffin luxury.",
      description: "Get wedding-ready with custom bridal art overlays, rhinestone detailing, a moisturizing wrap, and complementary champagne service.",
      price: 180,
      priceLabel: "From $180",
      durationLabel: "150 mins",
      features: ["Bridal Manicure", "Bridal Pedicure", "Nail Art & Embellishments", "Paraffin Treatment"],
      isPopular: false,
      isFeatured: true,
      image: "/images/about-hero-nail.jpg",
      sortOrder: 4,
    },
    {
      id: "np-5",
      categoryId: "pcat-mem",
      name: "Monthly Glow Membership",
      slug: "monthly-glow-membership",
      subtitle: "Regular Self-Care Commitment",
      shortDescription: "4 monthly manicure visits, priority booking & discount perks.",
      description: "A recurring subscription designed for nail enthusiasts. Enjoy weekly touch-ups, priority reservations, and exclusive member discounts on add-on art.",
      price: 159,
      priceLabel: "$159/mo",
      visitCountLabel: "4 Visits",
      features: ["4 Visits / Month", "10% Off Add-ons", "Priority Booking", "Exclusive Member Offers"],
      isPopular: false,
      isFeatured: true,
      image: "/images/about-salon.jpg",
      sortOrder: 5,
    },
    {
      id: "np-6",
      categoryId: "pcat-vip",
      name: "VIP Indulgence",
      slug: "vip-indulgence",
      subtitle: "The Ultimate Pampering Escape",
      shortDescription: "Ultra-luxurious gel manicure, spa pedicure, and massage.",
      description: "Indulge in our highest-tier service. Features extended arm massage, premium collagen glove wraps, custom nail gems, and private suite setting.",
      price: 220,
      priceLabel: "$220",
      durationLabel: "120 mins",
      features: ["Luxury Manicure", "Luxury Pedicure", "Spa Ritual", "Premium Nail Art"],
      isPopular: false,
      isFeatured: true,
      image: "/images/about-nail-detail.jpg",
      sortOrder: 6,
    },
  ];

  for (const pkg of nailPackages) {
    await prisma.nailPackage.upsert({
      where: { slug: pkg.slug },
      update: {
        categoryId: pkg.categoryId,
        name: pkg.name,
        subtitle: pkg.subtitle,
        shortDescription: pkg.shortDescription,
        description: pkg.description,
        price: pkg.price,
        priceLabel: pkg.priceLabel,
        durationLabel: pkg.durationLabel,
        visitCountLabel: pkg.visitCountLabel,
        badge: pkg.badge,
        features: pkg.features,
        isPopular: pkg.isPopular,
        isFeatured: pkg.isFeatured,
        image: pkg.image,
        sortOrder: pkg.sortOrder,
        isActive: true,
      },
      create: {
        id: pkg.id,
        categoryId: pkg.categoryId,
        name: pkg.name,
        slug: pkg.slug,
        subtitle: pkg.subtitle,
        shortDescription: pkg.shortDescription,
        description: pkg.description,
        price: pkg.price,
        priceLabel: pkg.priceLabel,
        durationLabel: pkg.durationLabel,
        visitCountLabel: pkg.visitCountLabel,
        badge: pkg.badge,
        features: pkg.features,
        isPopular: pkg.isPopular,
        isFeatured: pkg.isFeatured,
        image: pkg.image,
        sortOrder: pkg.sortOrder,
        isActive: true,
      },
    });
  }

  // 4. Package Benefits
  const benefits = [
    { id: "pb-1", icon: "sparkles", title: "Premium Products", description: "We use only high-quality, safe, and long-lasting products.", sortOrder: 1 },
    { id: "pb-2", icon: "calendar", title: "Flexible Booking", description: "Choose what works for you with easy and flexible scheduling.", sortOrder: 2 },
    { id: "pb-3", icon: "badge-check", title: "Expert Technicians", description: "Skilled professionals who deliver flawless results every time.", sortOrder: 3 },
    { id: "pb-4", icon: "gem", title: "Exclusive Savings", description: "Enjoy more services while saving more with package bundles.", sortOrder: 4 },
  ];

  for (const b of benefits) {
    await prisma.packageBenefit.upsert({
      where: { id: b.id },
      update: {
        icon: b.icon,
        title: b.title,
        description: b.description,
        sortOrder: b.sortOrder,
        isActive: true,
      },
      create: {
        id: b.id,
        icon: b.icon,
        title: b.title,
        description: b.description,
        sortOrder: b.sortOrder,
        isActive: true,
      },
    });
  }

  // 5. Comparison Features
  const comparisons = [
    { id: "pcf-1", featureName: "Manicure", essentialValue: "check", signatureValue: "check", premiumValue: "check", vipValue: "check", sortOrder: 1 },
    { id: "pcf-2", featureName: "Pedicure", essentialValue: "check", signatureValue: "check", premiumValue: "check", vipValue: "check", sortOrder: 2 },
    { id: "pcf-3", featureName: "Gel Polish", essentialValue: "-", signatureValue: "check", premiumValue: "check", vipValue: "check", sortOrder: 3 },
    { id: "pcf-4", featureName: "Nail Art Credit", essentialValue: "-", signatureValue: "-", premiumValue: "$15", vipValue: "$30", sortOrder: 4 },
    { id: "pcf-5", featureName: "Hand Massage", essentialValue: "-", signatureValue: "check", premiumValue: "check", vipValue: "check", sortOrder: 5 },
    { id: "pcf-6", featureName: "Spa Ritual", essentialValue: "-", signatureValue: "-", premiumValue: "-", vipValue: "check", sortOrder: 6 },
    { id: "pcf-7", featureName: "Priority Booking", essentialValue: "-", signatureValue: "-", premiumValue: "check", vipValue: "check", sortOrder: 7 },
    { id: "pcf-8", featureName: "Complimentary Drink", essentialValue: "-", signatureValue: "check", premiumValue: "check", vipValue: "check", sortOrder: 8 },
  ];

  for (const comp of comparisons) {
    await prisma.packageComparisonFeature.upsert({
      where: { id: comp.id },
      update: {
        featureName: comp.featureName,
        essentialValue: comp.essentialValue,
        signatureValue: comp.signatureValue,
        premiumValue: comp.premiumValue,
        vipValue: comp.vipValue,
        sortOrder: comp.sortOrder,
        isActive: true,
      },
      create: {
        id: comp.id,
        featureName: comp.featureName,
        essentialValue: comp.essentialValue,
        signatureValue: comp.signatureValue,
        premiumValue: comp.premiumValue,
        vipValue: comp.vipValue,
        sortOrder: comp.sortOrder,
        isActive: true,
      },
    });
  }

  // 6. Membership Rewards & Promo
  const rewards = [
    { id: "pr-1", icon: "percent", title: "10% Off Add-ons", description: "Save more on your favorite extra services.", sortOrder: 1 },
    { id: "pr-2", icon: "calendar", title: "Priority Booking", description: "Get early access and preferred time slots.", sortOrder: 2 },
    { id: "pr-3", icon: "gift", title: "Free Birthday Upgrade", description: "Enjoy a complimentary upgrade on your special day.", sortOrder: 3 },
    { id: "pr-4", icon: "gem", title: "Exclusive Member Pricing", description: "Members enjoy exclusive deals and seasonal offers.", sortOrder: 4 },
    {
      id: "pr-promo",
      icon: "gift",
      title: "Join & Save Promo",
      description: "on Your First Month",
      image: "/images/about-hero-nail.jpg",
      imageAlt: "Promo discount on first membership registration",
      promoTitle: "Join & Save",
      promoValue: "15%",
      buttonLabel: "Join Membership",
      buttonHref: "/booking",
      sortOrder: 5,
    },
  ];

  for (const r of rewards) {
    await prisma.packageReward.upsert({
      where: { id: r.id },
      update: {
        icon: r.icon,
        title: r.title,
        description: r.description,
        image: r.image,
        imageAlt: r.imageAlt,
        promoTitle: r.promoTitle,
        promoValue: r.promoValue,
        buttonLabel: r.buttonLabel,
        buttonHref: r.buttonHref,
        sortOrder: r.sortOrder,
        isActive: true,
      },
      create: {
        id: r.id,
        icon: r.icon,
        title: r.title,
        description: r.description,
        image: r.image,
        imageAlt: r.imageAlt,
        promoTitle: r.promoTitle,
        promoValue: r.promoValue,
        buttonLabel: r.buttonLabel,
        buttonHref: r.buttonHref,
        sortOrder: r.sortOrder,
        isActive: true,
      },
    });
  }

  // 7. Occasion Cards
  const occasions = [
    { id: "po-1", title: "Bridal Prep", description: "Look your best on your special day.", image: "/images/salon-experience-2.jpg", icon: "gem", sortOrder: 1 },
    { id: "po-2", title: "Self-Care Day", description: "Take time for you and recharge.", image: "/images/about-nail-detail.jpg", icon: "sparkles", sortOrder: 2 },
    { id: "po-3", title: "Regular Maintenance", description: "Keep your nails healthy and beautiful.", image: "/images/about-salon.jpg", icon: "heart", sortOrder: 3 },
    { id: "po-4", title: "Gift for Someone Special", description: "A thoughtful gift they'll truly love.", image: "/images/salon-experience-2.jpg", icon: "gift", sortOrder: 4 },
  ];

  for (const o of occasions) {
    await prisma.packageOccasion.upsert({
      where: { id: o.id },
      update: {
        title: o.title,
        description: o.description,
        image: o.image,
        icon: o.icon,
        sortOrder: o.sortOrder,
        isActive: true,
      },
      create: {
        id: o.id,
        title: o.title,
        description: o.description,
        image: o.image,
        icon: o.icon,
        sortOrder: o.sortOrder,
        isActive: true,
      },
    });
  }

  // 8. Process Steps
  const processSteps = [
    { id: "pps-1", step: "01", icon: "mouse-pointer", title: "Choose Package", description: "Select the package that fits your needs and wishes.", sortOrder: 1 },
    { id: "pps-2", step: "02", icon: "calendar-days", title: "Book Your Time", description: "Pick your preferred date and time easily online.", sortOrder: 2 },
    { id: "pps-3", step: "03", icon: "sparkles", title: "Enjoy the Experience", description: "Relax and enjoy luxury care from our experts.", sortOrder: 3 },
    { id: "pps-4", step: "04", icon: "smile", title: "Glow & Return", description: "Leave glowing and come back for your next pampering.", sortOrder: 4 },
  ];

  for (const st of processSteps) {
    await prisma.packageProcessStep.upsert({
      where: { id: st.id },
      update: {
        step: st.step,
        icon: st.icon,
        title: st.title,
        description: st.description,
        sortOrder: st.sortOrder,
        isActive: true,
      },
      create: {
        id: st.id,
        step: st.step,
        icon: st.icon,
        title: st.title,
        description: st.description,
        sortOrder: st.sortOrder,
        isActive: true,
      },
    });
  }

  // 9. Page Testimonials (Packages page)
  const pkgTestimonials = [
    {
      id: "pt-pkg-1",
      pageKey: "packages",
      name: "Emily R.",
      role: "Verified Client",
      rating: 5,
      quote: "The Signature Luxe package is my go-to! My nails look amazing and the experience is always so relaxing.",
      sortOrder: 1,
    },
    {
      id: "pt-pkg-2",
      pageKey: "packages",
      name: "Sophia T.",
      role: "Verified Client",
      rating: 5,
      quote: "Bridal Beauty Set made me feel so special before my big day. Highly recommend!",
      sortOrder: 2,
    },
    {
      id: "pt-pkg-3",
      pageKey: "packages",
      name: "Jessica M.",
      role: "Verified Client",
      rating: 5,
      quote: "As a member, I love the perks! Priority booking and savings make it totally worth it.",
      sortOrder: 3,
    },
  ];

  for (const t of pkgTestimonials) {
    await prisma.pageTestimonial.upsert({
      where: { id: t.id },
      update: {
        pageKey: t.pageKey,
        name: t.name,
        role: t.role,
        rating: t.rating,
        quote: t.quote,
        sortOrder: t.sortOrder,
        isActive: true,
      },
      create: {
        id: t.id,
        pageKey: t.pageKey,
        name: t.name,
        role: t.role,
        rating: t.rating,
        quote: t.quote,
        sortOrder: t.sortOrder,
        isActive: true,
      },
    });
  }

  // 10. Page FAQs (Packages page)
  const pkgFaqs = [
    {
      id: "pf-pkg-1",
      pageKey: "packages",
      question: "Can I customize a package?",
      answer: "Yes, you can swap polish tiers or add specific designs. Standard art options can be added at checkout.",
      sortOrder: 1,
    },
    {
      id: "pf-pkg-2",
      pageKey: "packages",
      question: "Do packages expire?",
      answer: "Individual package service credits are valid for 12 months from the date of purchase.",
      sortOrder: 2,
    },
    {
      id: "pf-pkg-3",
      pageKey: "packages",
      question: "Can I gift a package?",
      answer: "Absolutely! You can purchase any package as a digital gift voucher or a physical card in salon.",
      sortOrder: 3,
    },
    {
      id: "pf-pkg-4",
      pageKey: "packages",
      question: "Are memberships recurring?",
      answer: "Yes, monthly memberships auto-renew. You can pause or cancel at any time with a 7-day notice.",
      sortOrder: 4,
    },
  ];

  for (const f of pkgFaqs) {
    await prisma.pageFaq.upsert({
      where: { id: f.id },
      update: {
        pageKey: f.pageKey,
        question: f.question,
        answer: f.answer,
        sortOrder: f.sortOrder,
        isActive: true,
      },
      create: {
        id: f.id,
        pageKey: f.pageKey,
        question: f.question,
        answer: f.answer,
        sortOrder: f.sortOrder,
        isActive: true,
      },
    });
  }

  // 11. Media Assets
  const mediaAssets = [
    { id: "media-1", fileName: "blog-hero.jpg", url: "/images/blog-hero.jpg", alt: "Elegant nails and salon coffee table book styling", folder: "uploads" },
    { id: "media-2", fileName: "blog-featured.jpg", url: "/images/blog-featured.jpg", alt: "Manicure details highlighting a fresh glossy finish", folder: "uploads" },
    { id: "media-3", fileName: "blog-side-1.jpg", url: "/images/blog-side-1.jpg", alt: "Bridal nails close-up detail", folder: "uploads" },
    { id: "media-4", fileName: "blog-side-2.jpg", url: "/images/blog-side-2.jpg", alt: "Autumn nail colors display", folder: "uploads" },
    { id: "media-5", fileName: "blog-1.jpg", url: "/images/blog-1.jpg", alt: "Natural healthy nails styling detail", folder: "uploads" },
    { id: "media-6", fileName: "blog-2.jpg", url: "/images/blog-2.jpg", alt: "Nude nails manicure minimal setting", folder: "uploads" },
    { id: "media-7", fileName: "blog-3.jpg", url: "/images/blog-3.jpg", alt: "Gel polish application closeup", folder: "uploads" },
    { id: "media-8", fileName: "blog-4.jpg", url: "/images/blog-4.jpg", alt: "Moisturizing hand cream massage", folder: "uploads" },
    { id: "media-9", fileName: "blog-5.jpg", url: "/images/blog-5.jpg", alt: "Relaxed customer in premium nail salon lounge", folder: "uploads" },
    { id: "media-10", fileName: "blog-6.jpg", url: "/images/blog-6.jpg", alt: "Ornate bridal nails with rings details", folder: "uploads" },
    { id: "media-11", fileName: "blog-7.jpg", url: "/images/blog-7.jpg", alt: "Luxury gift boxes wrapping styling", folder: "uploads" },
    { id: "media-12", fileName: "blog-8.jpg", url: "/images/blog-8.jpg", alt: "Manicure details highlighting clean nails", folder: "uploads" },
    { id: "media-13", fileName: "blog-editor-1.jpg", url: "/images/blog-editor-1.jpg", alt: "Long lasting polished nails", folder: "uploads" },
    { id: "media-14", fileName: "blog-editor-2.jpg", url: "/images/blog-editor-2.jpg", alt: "Artistic nails detailing special design", folder: "uploads" },
    { id: "media-15", fileName: "blog-editor-3.jpg", url: "/images/blog-editor-3.jpg", alt: "Spring colors and floral details design", folder: "uploads" },
  ];

  for (const m of mediaAssets) {
    await prisma.mediaAsset.upsert({
      where: { id: m.id },
      update: {
        fileName: m.fileName,
        url: m.url,
        alt: m.alt,
        folder: m.folder,
      },
      create: {
        id: m.id,
        fileName: m.fileName,
        url: m.url,
        alt: m.alt,
        folder: m.folder,
      },
    });
  }

  // 12. Blog Page Setting
  await prisma.blogPageSetting.upsert({
    where: { id: "blog-settings-main" },
    update: {
      seoTitle: "Nail Beauty Journal | Aera Nail Lounge",
      seoDescription: "Discover expert tips, seasonal nail trends, self-care routines, and guides curated by Aera Nail Lounge specialists.",
      heroEyebrow: "NAIL BEAUTY JOURNAL",
      heroTitle: "Insights, Inspiration &",
      heroHighlight: "Beauty Stories",
      heroDescription: "Discover expert tips, seasonal trends, and self-care guides curated for modern nail lovers by Aera specialists.",
      heroImage: "/images/blog-hero.jpg",
      heroImageAlt: "Elegant nails and salon coffee table book styling",
      primaryButtonLabel: "Explore Articles",
      primaryButtonHref: "#articles-list",
      secondaryButtonLabel: "Subscribe Now",
      secondaryButtonHref: "#newsletter-section",
      latestTitle: "Latest Articles",
      browseTitle: "Browse by Category",
      editorsPickTitle: "Editor's Picks",
      testimonialsTitle: "What Our Readers Say",
      sidebarCategoriesTitle: "Popular Categories",
      sidebarTrendingTitle: "Trending Posts",
      newsletterTitle: "Get Beauty Stories Straight to Your Inbox",
      newsletterDescription: "Subscribe to our newsletter for tips, trends & exclusive offers.",
      newsletterPlaceholder: "Enter your email",
      newsletterButtonLabel: "Subscribe Now",
      ctaTitle: "Stay Inspired with Aera Nail Lounge",
      ctaDescription: "Book your next appointment and experience luxury nail care.",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(213) 555-1980",
      email: "hello@aeranaillounge.com",
      address: "123 Luxury Blvd, Suite 100, Los Angeles, CA 90001",
      hours: "Mon - Sun: 10:00 AM - 8:00 PM",
    },
    create: {
      id: "blog-settings-main",
      seoTitle: "Nail Beauty Journal | Aera Nail Lounge",
      seoDescription: "Discover expert tips, seasonal nail trends, self-care routines, and guides curated by Aera Nail Lounge specialists.",
      heroEyebrow: "NAIL BEAUTY JOURNAL",
      heroTitle: "Insights, Inspiration &",
      heroHighlight: "Beauty Stories",
      heroDescription: "Discover expert tips, seasonal trends, and self-care guides curated for modern nail lovers by Aera specialists.",
      heroImage: "/images/blog-hero.jpg",
      heroImageAlt: "Elegant nails and salon coffee table book styling",
      primaryButtonLabel: "Explore Articles",
      primaryButtonHref: "#articles-list",
      secondaryButtonLabel: "Subscribe Now",
      secondaryButtonHref: "#newsletter-section",
      latestTitle: "Latest Articles",
      browseTitle: "Browse by Category",
      editorsPickTitle: "Editor's Picks",
      testimonialsTitle: "What Our Readers Say",
      sidebarCategoriesTitle: "Popular Categories",
      sidebarTrendingTitle: "Trending Posts",
      newsletterTitle: "Get Beauty Stories Straight to Your Inbox",
      newsletterDescription: "Subscribe to our newsletter for tips, trends & exclusive offers.",
      newsletterPlaceholder: "Enter your email",
      newsletterButtonLabel: "Subscribe Now",
      ctaTitle: "Stay Inspired with Aera Nail Lounge",
      ctaDescription: "Book your next appointment and experience luxury nail care.",
      ctaButtonLabel: "Book Your Appointment",
      ctaButtonHref: "/booking",
      phone: "(213) 555-1980",
      email: "hello@aeranaillounge.com",
      address: "123 Luxury Blvd, Suite 100, Los Angeles, CA 90001",
      hours: "Mon - Sun: 10:00 AM - 8:00 PM",
    },
  });

  // 13. Blog Categories
  const blogCats = [
    { id: "bcat-1", name: "Nail Care", slug: "nail-care", description: "Healthy habits for strong and glowing nails.", sortOrder: 1 },
    { id: "bcat-2", name: "Trends", slug: "trends", description: "Seasonal colors, patterns, and shape directions.", sortOrder: 2 },
    { id: "bcat-3", name: "Bridal", slug: "bridal", description: "Perfect wedding manicure prep and styling ideas.", sortOrder: 3 },
    { id: "bcat-4", name: "Salon Tips", slug: "salon-tips", description: "Make the most of your salon visits and etiquette.", sortOrder: 4 },
    { id: "bcat-5", name: "Wellness", slug: "wellness", description: "Self-care rituals and overall hand health.", sortOrder: 5 },
    { id: "bcat-6", name: "Promotions", slug: "promotions", description: "Exclusive packages, discounts, and announcements.", sortOrder: 6 },
    { id: "bcat-7", name: "Guides", slug: "guides", description: "Step-by-step tutorials and detailed advice.", sortOrder: 7 },
  ];

  for (const c of blogCats) {
    await prisma.blogCategory.upsert({
      where: { id: c.id },
      update: {
        name: c.name,
        slug: c.slug,
        description: c.description,
        sortOrder: c.sortOrder,
        isActive: true,
      },
      create: {
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        sortOrder: c.sortOrder,
        isActive: true,
      },
    });
  }

  // 14. Blog Posts
  const blogPosts = [
    {
      id: "bp-featured",
      categoryId: "bcat-1",
      title: "How to Keep Your Gel Manicure Looking Fresh Longer",
      slug: "how-to-keep-gel-manicure-looking-fresh-longer",
      excerpt: "Expert-backed tips to extend the life of your gel manicure—without compromising shine, strength, or nail health.",
      content: "<p>Gel manicures are a wonderful investment for durable, shiny nails. However, to keep them looking fresh beyond the two-week mark requires some intentional post-salon habits.</p><h3>1. Keep Cuticles Hydrated</h3><p>Daily cuticle oil application prevents lifting. When the surrounding skin dries, it naturally pulls away, taking the gel layer with it.</p><h3>2. Protect Your Hands</h3><p>Wear rubber gloves when cleaning or doing dishes. Hot water and soap chemicals weaken the gel bonding agent over time.</p><h3>3. Do Not Pick or Peel</h3><p>If a corner lifts, do not pull it. Peeling damages the top layers of your natural nail bed, making future polish adhesion weaker.</p>",
      coverImage: "/images/blog-featured.jpg",
      coverImageAlt: "Manicure details highlighting a fresh glossy finish",
      authorName: "Aera Team",
      authorRole: "Nail Artist Specialist",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      isFeatured: true,
      isTrending: true,
      isEditorsPick: false,
      publishedAt: new Date("2026-05-10T09:00:00.000Z"),
    },
    {
      id: "bp-side-1",
      categoryId: "bcat-3",
      title: "Top Bridal Nail Trends for Elegant Weddings",
      slug: "top-bridal-nail-trends-elegant-weddings",
      excerpt: "Classic French variations, subtle glimmers, and sophisticated chrome tips for your wedding day.",
      content: "<p>Your wedding day manicure will be highlighted in ring closeups. This season, bridal styling moves towards refined minimalism with subtle luxury accents.</p><h3>Soft Pearl Chrome</h3><p>A translucent pearlescent chrome powder applied over a milky white base gives a glowing candlelit aesthetic.</p><h3>Micro French Tips</h3><p>Swapping thick white lines for ultra-thin gold or silver micro French tips adds a delicate modern shimmer.</p>",
      coverImage: "/images/blog-side-1.jpg",
      coverImageAlt: "Bridal nails close-up detail",
      authorName: "Sophia C.",
      authorRole: "Lead Stylist",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: true,
      isEditorsPick: false,
      publishedAt: new Date("2026-05-05T09:00:00.000Z"),
    },
    {
      id: "bp-side-2",
      categoryId: "bcat-2",
      title: "The Best Seasonal Shades for Autumn Glam",
      slug: "best-seasonal-shades-autumn-glam",
      excerpt: "Deep chocolate browns, warm copper hues, and forest green manicures to try this fall.",
      content: "<p>Autumn is the perfect time to embrace rich, comforting hues. Say goodbye to pastel pinks and explore warm editorial tones.</p><h3>Spiced Espresso</h3><p>A high-gloss deep espresso brown that looks almost black in low light, offering sophisticated warmth.</p>",
      coverImage: "/images/blog-side-2.jpg",
      coverImageAlt: "Autumn nail colors display",
      authorName: "Sophia C.",
      authorRole: "Lead Stylist",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-04-28T09:00:00.000Z"),
    },
    {
      id: "bp-latest-1",
      categoryId: "bcat-5",
      title: "5 Signs Your Nails Need a Wellness Reset",
      slug: "5-signs-nails-need-wellness-reset",
      excerpt: "Learn the subtle signs your nails are trying to tell you—and how to restore their natural strength.",
      content: "<p>Constant polishing without breaks can lead to yellowing, brittle layers, and surface peeling. Here are five symptoms that highlight the need for a brief lacquer holiday and active repair treatments.</p>",
      coverImage: "/images/blog-1.jpg",
      coverImageAlt: "Natural healthy nails styling detail",
      authorName: "Aera Team",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-05-08T09:00:00.000Z"),
    },
    {
      id: "bp-latest-2",
      categoryId: "bcat-2",
      title: "Minimal Nude Nails: A Timeless Luxury Look",
      slug: "minimal-nude-nails-timeless-luxury-look",
      excerpt: "Effortless, elegant, and always in style—discover why nude nails never go out of fashion.",
      content: "<p>Nude nails match every outfit, skin tone, and season. The key is selecting the correct undertone (cool pink, warm peach, or neutral beige) to elongate your fingers naturally.</p>",
      coverImage: "/images/blog-2.jpg",
      coverImageAlt: "Nude nails manicure minimal setting",
      authorName: "Sophia C.",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: true,
      isEditorsPick: false,
      publishedAt: new Date("2026-05-03T09:00:00.000Z"),
    },
    {
      id: "bp-latest-3",
      categoryId: "bcat-7",
      title: "Everything You Need to Know About Gel Polish",
      slug: "everything-you-need-to-know-about-gel-polish",
      excerpt: "From application to safe removal, here is your complete guide to long-lasting gel manicures.",
      content: "<p>Gel polish requires UV curing for its polymer bond. Understanding the distinction between hard gel extensions and soak-off soft gel helps you choose the healthiest option for your nail plates.</p>",
      coverImage: "/images/blog-3.jpg",
      coverImageAlt: "Gel polish application closeup",
      authorName: "Aera Team",
      readTimeMinutes: 6,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-04-26T09:00:00.000Z"),
    },
    {
      id: "bp-latest-4",
      categoryId: "bcat-1",
      title: "Nail Care Routine for Stronger, Healthier Nails",
      slug: "nail-care-routine-stronger-healthier-nails",
      excerpt: "A simple daily routine that keeps your nails strong, shiny, and beautiful all year round.",
      content: "<p>Great nails are built on consistency. Hydrating cuticle oil twice a day and filing only in one direction with a glass file makes a massive difference in preventing splits.</p>",
      coverImage: "/images/blog-4.jpg",
      coverImageAlt: "Moisturizing hand cream massage",
      authorName: "Sophia C.",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-04-21T09:00:00.000Z"),
    },
    {
      id: "bp-latest-5",
      categoryId: "bcat-4",
      title: "Nail Salon Etiquette: Do's & Don'ts",
      slug: "nail-salon-etiquette-dos-donts",
      excerpt: "A quick guide to help you enjoy the best salon experience—for you and everyone around you.",
      content: "<p>Arrive on time, bring inspirational images, and communicate clearly with your artist. Avoid talking on speakerphone to respect the relaxing atmosphere of the lounge.</p>",
      coverImage: "/images/blog-5.jpg",
      coverImageAlt: "Relaxed customer in premium nail salon lounge",
      authorName: "Aera Team",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-05-09T09:00:00.000Z"),
    },
    {
      id: "bp-latest-6",
      categoryId: "bcat-3",
      title: "Bridal Nail Care Timeline: Your Prep Guide",
      slug: "bridal-nail-care-timeline-prep-guide",
      excerpt: "When to start, what to do, and how to get picture-perfect nails for your wedding day.",
      content: "<p>Start conditioning your cuticles 6 months ahead. Have your trial manicure 1 month before, and your actual wedding day manicure 2-3 days before the ceremony.</p>",
      coverImage: "/images/blog-6.jpg",
      coverImageAlt: "Ornate bridal nails with rings details",
      authorName: "Sophia C.",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-04-15T09:00:00.000Z"),
    },
    {
      id: "bp-latest-7",
      categoryId: "bcat-6",
      title: "The Perfect Nail Care Gifts for Every Occasion",
      slug: "perfect-nail-care-gifts-every-occasion",
      excerpt: "Thoughtful, luxurious, and always appreciated—our top-gift picks for nail lovers.",
      content: "<p>Luxury cuticle butter, glass files, high-end hand balms, and gift cards for full spa manicures are always appreciated.</p>",
      coverImage: "/images/blog-7.jpg",
      coverImageAlt: "Luxury gift boxes wrapping styling",
      authorName: "Aera Team",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-04-10T09:00:00.000Z"),
    },
    {
      id: "bp-latest-8",
      categoryId: "bcat-5",
      title: "How Your Nails Reflect Your Overall Health",
      slug: "how-your-nails-reflect-overall-health",
      excerpt: "What your nails can reveal about your body—and how to support your health from within.",
      content: "<p>White spots, ridges, and brittleness are often signs of vitamin deficiencies. Learn what changes to look out for.</p>",
      coverImage: "/images/blog-8.jpg",
      coverImageAlt: "Manicure details highlighting clean nails",
      authorName: "Sophia C.",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      publishedAt: new Date("2026-04-05T09:00:00.000Z"),
    },
    {
      id: "bp-ep-1",
      categoryId: "bcat-1",
      title: "The Ultimate Guide to Long-Lasting Manicures",
      slug: "ultimate-guide-long-lasting-manicures",
      excerpt: "Get weeks of chip-free nails with these essential prep steps and professional maintenance habits.",
      content: "<p>To ensure maximum polish durability, dehydrating the nail plate with alcohol before base coating is vital. Cap the free edges of the nail with polish to seal it.</p>",
      coverImage: "/images/blog-editor-1.jpg",
      coverImageAlt: "Long lasting polished nails",
      authorName: "Aera Team",
      readTimeMinutes: 6,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: true,
      publishedAt: new Date("2026-04-12T09:00:00.000Z"),
    },
    {
      id: "bp-ep-2",
      categoryId: "bcat-2",
      title: "Luxury Nail Art Ideas for Special Occasions",
      slug: "luxury-nail-art-ideas-special-occasions",
      excerpt: "Sparkling accents, 3D elements, and delicate gold foils to make you shine at your next event.",
      content: "<p>Elevate your look with hand-painted gold leaf, subtle glitter fades, or miniature gemstone clusters near the nail beds.</p>",
      coverImage: "/images/blog-editor-2.jpg",
      coverImageAlt: "Artistic nails detailing special design",
      authorName: "Sophia C.",
      readTimeMinutes: 5,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: true,
      publishedAt: new Date("2026-04-02T09:00:00.000Z"),
    },
    {
      id: "bp-ep-3",
      categoryId: "bcat-2",
      title: "Spring Nail Trends You'll Love in 2024",
      slug: "spring-nail-trends-love-2024",
      excerpt: "Pastel shades, floral details, and glazed donut nails are blooming this season.",
      content: "<p>Spring brings pastel lavender, matcha green, chrome glazes, and micro floral nail art prints.</p>",
      coverImage: "/images/blog-editor-3.jpg",
      coverImageAlt: "Spring colors and floral details design",
      authorName: "Aera Team",
      readTimeMinutes: 4,
      status: "PUBLISHED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: true,
      publishedAt: new Date("2026-03-28T09:00:00.000Z"),
    },
    {
      id: "bp-draft",
      categoryId: "bcat-1",
      title: "Draft Post: Behind the Scenes of Aera Nail Salon",
      slug: "draft-post-behind-scenes-aera-salon",
      excerpt: "A draft article showing how we source our non-toxic polishes and prepare clean workspaces.",
      content: "<p>Draft content only visible in admin panel.</p>",
      coverImage: "/images/blog-1.jpg",
      authorName: "Aera Team",
      readTimeMinutes: 3,
      status: "DRAFT",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
    },
    {
      id: "bp-scheduled",
      categoryId: "bcat-2",
      title: "Scheduled Post: Winter Glitter Styles",
      slug: "scheduled-post-winter-glitter-styles",
      excerpt: "A scheduled article highlighting glitter options for New Year's Eve parties.",
      content: "<p>Scheduled article detail only.</p>",
      coverImage: "/images/blog-featured.jpg",
      authorName: "Sophia C.",
      readTimeMinutes: 4,
      status: "SCHEDULED",
      isFeatured: false,
      isTrending: false,
      isEditorsPick: false,
      scheduledAt: new Date("2026-08-15T09:00:00.000Z"),
    },
  ];

  for (const bp of blogPosts) {
    await prisma.blogPost.upsert({
      where: { id: bp.id },
      update: {
        categoryId: bp.categoryId,
        title: bp.title,
        slug: bp.slug,
        excerpt: bp.excerpt,
        content: bp.content,
        coverImage: bp.coverImage,
        coverImageAlt: bp.coverImageAlt ?? null,
        authorName: bp.authorName,
        authorRole: bp.authorRole ?? null,
        readTimeMinutes: bp.readTimeMinutes,
        status: bp.status as any,
        isFeatured: bp.isFeatured,
        isTrending: bp.isTrending,
        isEditorsPick: bp.isEditorsPick,
        publishedAt: bp.publishedAt ?? null,
        scheduledAt: bp.scheduledAt ?? null,
      },
      create: {
        id: bp.id,
        categoryId: bp.categoryId,
        title: bp.title,
        slug: bp.slug,
        excerpt: bp.excerpt,
        content: bp.content,
        coverImage: bp.coverImage,
        coverImageAlt: bp.coverImageAlt ?? null,
        authorName: bp.authorName,
        authorRole: bp.authorRole ?? null,
        readTimeMinutes: bp.readTimeMinutes,
        status: bp.status as any,
        isFeatured: bp.isFeatured,
        isTrending: bp.isTrending,
        isEditorsPick: bp.isEditorsPick,
        publishedAt: bp.publishedAt ?? null,
        scheduledAt: bp.scheduledAt ?? null,
      },
    });
  }

  // 15. Blog Page Testimonials (pageKey = blog)
  const blogTestimonials = [
    {
      id: "bt-1",
      pageKey: "blog",
      name: "Jessica R.",
      role: "Blog Reader",
      avatar: "/images/client-1.jpg",
      avatarAlt: "Jessica review profile",
      rating: 5,
      quote: "The articles are so informative and easy to follow. I've learned so much about nail care and feel more confident taking care of my nails at home!",
      sortOrder: 1,
    },
    {
      id: "bt-2",
      pageKey: "blog",
      name: "Sophia L.",
      role: "Loyal Client",
      avatar: "/images/client-2.jpg",
      avatarAlt: "Sophia review profile",
      rating: 5,
      quote: "Aera's blog is my go-to for all things nails! The tips are practical, and the trends are always spot on. Absolutely love it!",
      sortOrder: 2,
    },
    {
      id: "bt-3",
      pageKey: "blog",
      name: "Emily T.",
      role: "Blog Reader",
      avatar: "/images/client-3.jpg",
      avatarAlt: "Emily review profile",
      rating: 5,
      quote: "Beautiful content and expert advice every time. It's like having a nail pro in your pocket!",
      sortOrder: 3,
    },
  ];

  for (const t of blogTestimonials) {
    await prisma.pageTestimonial.upsert({
      where: { id: t.id },
      update: {
        pageKey: t.pageKey,
        name: t.name,
        role: t.role,
        avatar: t.avatar,
        avatarAlt: t.avatarAlt,
        rating: t.rating,
        quote: t.quote,
        sortOrder: t.sortOrder,
        isActive: true,
      },
      create: {
        id: t.id,
        pageKey: t.pageKey,
        name: t.name,
        role: t.role,
        avatar: t.avatar,
        avatarAlt: t.avatarAlt,
        rating: t.rating,
        quote: t.quote,
        sortOrder: t.sortOrder,
        isActive: true,
      },
    });
  }

  console.log("Seeding media folders...");
  const mediaFolders = [
    { name: "General", slug: "general", sortOrder: 0 },
    { name: "About", slug: "about", sortOrder: 1 },
    { name: "Services", slug: "services", sortOrder: 2 },
    { name: "Gallery", slug: "gallery", sortOrder: 3 },
    { name: "Packages", slug: "packages", sortOrder: 4 },
    { name: "Blog", slug: "blog", sortOrder: 5 },
    { name: "SEO", slug: "seo", sortOrder: 6 },
    { name: "Team", slug: "team", sortOrder: 7 },
    { name: "Promotions", slug: "promotions", sortOrder: 8 },
  ];
  for (const folder of mediaFolders) {
    await prisma.mediaFolder.upsert({
      where: { slug: folder.slug },
      update: { name: folder.name, sortOrder: folder.sortOrder },
      create: folder,
    });
  }

  console.log("Seeding SEO metadata...");
  const seoDefaults = [
    { scopeKey: "page:home", pageKey: "home", title: "Aera Nail Lounge — Luxury Nail Salon", description: "Experience luxury nail care at Aera Nail Lounge. Premium manicures, pedicures, nail art & spa treatments." },
    { scopeKey: "page:about", pageKey: "about", title: "About Us — Aera Nail Lounge", description: "Discover our story, our team of expert nail artists, and our commitment to luxury nail care." },
    { scopeKey: "page:services", pageKey: "services", title: "Our Services — Aera Nail Lounge", description: "Explore our full range of manicure, pedicure, gel polish, nail art, spa treatments & extensions." },
    { scopeKey: "page:gallery", pageKey: "gallery", title: "Gallery — Aera Nail Lounge", description: "Browse our nail art gallery featuring trending designs, collections, and client transformations." },
    { scopeKey: "page:packages", pageKey: "packages", title: "Packages — Aera Nail Lounge", description: "Choose from our curated nail care packages designed for every occasion and budget." },
    { scopeKey: "page:promotions", pageKey: "promotions", title: "Promotions — Aera Nail Lounge", description: "Check out our latest deals, seasonal offers, and exclusive discounts." },
    { scopeKey: "page:contact", pageKey: "contact", title: "Contact Us — Aera Nail Lounge", description: "Get in touch with Aera Nail Lounge. Book an appointment, find our location, or reach us by phone." },
    { scopeKey: "page:blog", pageKey: "blog", title: "Nail Beauty Journal — Aera Nail Lounge", description: "Read our expert tips on nail care, trending styles, beauty routines, and salon news." },
  ];
  for (const seo of seoDefaults) {
    await prisma.seoMetadata.upsert({
      where: { scopeKey: seo.scopeKey },
      update: {},
      create: seo,
    });
  }

  // Seed Business Settings
  console.log("Seeding business settings...");
  await prisma.businessSetting.upsert({
    where: { key: "default" },
    update: {},
    create: {
      key: "default",
      timezone: "America/Los_Angeles",
      currency: "USD",
    },
  });

  console.log("TS Seed completed successfully!");
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
