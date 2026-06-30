import type { Booking, Package, Service, Technician } from "./types";

export const business = {
  name: "Aera Nail Lounge",
  email: "hello@aeranailounge.com",
  phone: "(626) 555-7890",
  rawPhone: "16265557890",
  address: "Los Angeles, California",
  hours: "Mon - Sun: 10:00 AM - 8:00 PM",
  timezone: "America/Los_Angeles",
  taxRate: 0.095,
  depositRate: 0.25,
  bufferMinutes: 15
};

export const addons = [
  { id: "french-tips", name: "French Tips", duration: 10, price: 12 },
  { id: "nail-repair", name: "Nail Repair", duration: 15, price: 10 },
  { id: "hand-massage", name: "Hand Massage", duration: 15, price: 18 },
  { id: "gel-removal", name: "Gel Removal", duration: 20, price: 15 }
];

export const services: Service[] = [
  {
    id: "classic-manicure",
    slug: "classic-manicure",
    category: "Manicure",
    name: "Classic Manicure",
    description: "Clean shaping, cuticle care, massage and polish.",
    longDescription: "A refined everyday manicure with detailed shaping, cuticle care, hydration and a flawless polish finish.",
    duration: 35,
    price: 32,
    image: "/nail-art-1.png",
    addons: ["french-tips", "hand-massage", "gel-removal"],
    technicianIds: ["emily", "sophia", "lily"],
    faqs: [{ question: "How long does it last?", answer: "Regular polish usually lasts 5-7 days with proper care." }]
  },
  {
    id: "luxury-manicure",
    slug: "luxury-manicure",
    category: "Manicure",
    name: "Luxury Manicure",
    description: "Premium manicure with exfoliation, mask and warm towel.",
    longDescription: "A complete hand-care ritual with exfoliation, nourishing mask, warm towel, massage and premium polish.",
    duration: 55,
    price: 55,
    image: "/hero-manicure.png",
    addons: ["french-tips", "hand-massage", "nail-repair"],
    technicianIds: ["emily", "sophia"],
    faqs: [{ question: "Is it good for dry hands?", answer: "Yes, the mask and massage are designed for hydration and softness." }]
  },
  {
    id: "classic-pedicure",
    slug: "classic-pedicure",
    category: "Pedicure",
    name: "Classic Pedicure",
    description: "Relaxing foot soak, shaping, cuticle care and polish.",
    longDescription: "A restorative pedicure with a warm soak, detailed nail care, callus smoothing and polish.",
    duration: 45,
    price: 45,
    image: "/nail-salon-interior.png",
    addons: ["french-tips", "gel-removal"],
    technicianIds: ["sophia", "lily", "maria"],
    faqs: [{ question: "Do you sanitize tools?", answer: "Yes, all implements are sterilized and single-use items are discarded." }]
  },
  {
    id: "luxury-pedicure",
    slug: "luxury-pedicure",
    category: "Pedicure",
    name: "Luxury Pedicure",
    description: "Spa pedicure with scrub, mask, massage and polish.",
    longDescription: "A luxurious foot-care experience with exfoliation, mask, hot towel, extended massage and polish.",
    duration: 70,
    price: 72,
    image: "/nail-salon-interior.png",
    addons: ["hand-massage", "gel-removal"],
    technicianIds: ["sophia", "maria"],
    faqs: [{ question: "Can I add gel polish?", answer: "Yes, gel polish can be added during booking." }]
  },
  {
    id: "gel-polish",
    slug: "gel-polish",
    category: "Gel",
    name: "Gel Polish",
    description: "Glossy long-wear color with high-shine finish.",
    longDescription: "Durable gel polish applied with precision for a glossy, chip-resistant finish.",
    duration: 45,
    price: 48,
    image: "/nail-art-2.png",
    addons: ["french-tips", "gel-removal", "nail-repair"],
    technicianIds: ["emily", "lily"],
    faqs: [{ question: "How long does gel last?", answer: "Most clients enjoy 2-3 weeks of wear." }]
  },
  {
    id: "gel-x-full-set",
    slug: "gel-x-full-set",
    category: "Extensions",
    name: "Gel X Full Set",
    description: "Lightweight extensions with elegant shaping.",
    longDescription: "A flexible extension system for length, strength and a beautifully sculpted silhouette.",
    duration: 90,
    price: 88,
    image: "/nail-art-3.png",
    addons: ["french-tips", "nail-repair"],
    technicianIds: ["emily", "lily"],
    faqs: [{ question: "Can I choose length?", answer: "Yes, your technician will help select length and shape." }]
  },
  {
    id: "biab-nails",
    slug: "biab-nails",
    category: "Gel",
    name: "BIAB Nails",
    description: "Builder gel for natural strength and structure.",
    longDescription: "Builder in a bottle helps protect natural nails while creating a smooth, structured finish.",
    duration: 65,
    price: 68,
    image: "/hero-manicure.png",
    addons: ["french-tips", "nail-repair", "gel-removal"],
    technicianIds: ["sophia", "lily"],
    faqs: [{ question: "Is BIAB for natural nails?", answer: "Yes, it is ideal for strengthening natural nails." }]
  },
  {
    id: "nail-art",
    slug: "nail-art",
    category: "Nail Art",
    name: "Nail Art",
    description: "Minimal, elegant, glitter or custom art details.",
    longDescription: "Custom nail art from delicate accents to expressive statement designs.",
    duration: 30,
    price: 25,
    image: "/nail-art-2.png",
    addons: ["french-tips"],
    technicianIds: ["emily", "lily", "maria"],
    faqs: [{ question: "Can I bring reference images?", answer: "Absolutely. Bring your inspiration and we will tailor it." }]
  },
  {
    id: "spa-treatment",
    slug: "spa-treatment",
    category: "Spa",
    name: "Spa Treatment",
    description: "Rejuvenating hand and foot care treatment.",
    longDescription: "A calm spa add-on focused on hydration, massage and relaxation.",
    duration: 40,
    price: 42,
    image: "/nail-salon-interior.png",
    addons: ["hand-massage"],
    technicianIds: ["sophia", "maria"],
    faqs: [{ question: "Can it be booked alone?", answer: "Yes, or paired with manicure and pedicure services." }]
  },
  {
    id: "extensions",
    slug: "extensions",
    category: "Extensions",
    name: "Extensions",
    description: "Strong, beautiful extensions shaped for your style.",
    longDescription: "Classic extension services for durable length and polished shaping.",
    duration: 85,
    price: 82,
    image: "/nail-art-3.png",
    addons: ["nail-repair", "french-tips"],
    technicianIds: ["emily", "lily"],
    faqs: [{ question: "Do extensions damage nails?", answer: "Proper application and removal help protect natural nails." }]
  }
];

export const technicians: Technician[] = [
  { id: "emily", name: "Emily Nguyen", role: "Nail Artist", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=85", specialty: "Gel X, minimal art", rating: 4.9, experience: "7 years", serviceIds: ["classic-manicure", "luxury-manicure", "gel-polish", "gel-x-full-set", "nail-art", "extensions"] },
  { id: "sophia", name: "Sophia Tran", role: "Senior Nail Technician", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=85", specialty: "Pedicure, BIAB", rating: 4.8, experience: "9 years", serviceIds: ["classic-manicure", "luxury-manicure", "classic-pedicure", "luxury-pedicure", "biab-nails", "spa-treatment"] },
  { id: "lily", name: "Lily Pham", role: "Nail Specialist", avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=85", specialty: "Nail art, gel polish", rating: 4.9, experience: "6 years", serviceIds: ["classic-manicure", "classic-pedicure", "gel-polish", "gel-x-full-set", "biab-nails", "nail-art", "extensions"] },
  { id: "maria", name: "Maria Lee", role: "Spa Technician", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=85", specialty: "Spa treatment, luxury pedicure", rating: 4.7, experience: "5 years", serviceIds: ["classic-pedicure", "luxury-pedicure", "nail-art", "spa-treatment"] }
];

export const packages: Package[] = [
  { id: "essential-care", slug: "essential-care", name: "Essential Care", description: "Perfect for regular maintenance and everyday beauty.", price: 45, duration: 75, serviceIds: ["classic-manicure", "classic-pedicure"] },
  { id: "signature-luxe", slug: "signature-luxe", name: "Signature Luxe", description: "Our most loved package for the ultimate pampering.", price: 75, duration: 115, serviceIds: ["luxury-manicure", "luxury-pedicure", "gel-polish"], featured: true },
  { id: "premium-glam", slug: "premium-glam", name: "Premium Glam", description: "Extended care, nail art and a polished luxury finish.", price: 110, duration: 150, serviceIds: ["luxury-manicure", "luxury-pedicure", "gel-polish", "nail-art"] }
];

export const promotions = [
  { id: "welcome10", code: "WELCOME10", title: "10% Off Your First Visit", discountType: "percentage", amount: 10, active: true, firstBookingOnly: true, validUntil: "2026-12-31" },
  { id: "luxe15", code: "LUXE15", title: "$15 Off Signature Luxe", discountType: "fixed", amount: 15, active: true, firstBookingOnly: false, validUntil: "2026-09-30" }
];

export const gallery = [
  { id: "g1", category: "Minimal", title: "Soft pink gold line", image: "/nail-art-1.png" },
  { id: "g2", category: "Elegant", title: "Champagne almond manicure", image: "/nail-art-2.png" },
  { id: "g3", category: "Glitter", title: "Pearl glitter detail", image: "/nail-art-3.png" },
  { id: "g4", category: "Nail Art", title: "Luxury gold detail", image: "/hero-manicure.png" },
  { id: "g5", category: "Extensions", title: "Sculpted gel extensions", image: "/nail-art-3.png" },
  { id: "g6", category: "Elegant", title: "Aera lounge interior", image: "/nail-salon-interior.png" }
];

export const reviews = [
  { id: "r1", customer: "Jessica M.", rating: 5, text: "The best nail salon experience. The staff is friendly, talented and incredibly detailed.", approved: true },
  { id: "r2", customer: "Amanda R.", rating: 5, text: "Beautiful salon, clean tools and my gel set lasted perfectly.", approved: true },
  { id: "r3", customer: "Kelly S.", rating: 4, text: "Calm, premium and very professional.", approved: true }
];

export const inventory = [
  { id: "i1", name: "Gel Polish", sku: "GEL-001", category: "Polish", unit: "bottle", currentStock: 8, reorderLevel: 10, supplier: "Aera Pro Supply", costPerUnit: 7.5 },
  { id: "i2", name: "Nail Files", sku: "FILE-100", category: "Tools", unit: "pack", currentStock: 6, reorderLevel: 12, supplier: "Salon Essentials", costPerUnit: 4 },
  { id: "i3", name: "Cuticle Oil", sku: "OIL-030", category: "Care", unit: "bottle", currentStock: 5, reorderLevel: 8, supplier: "Aera Pro Supply", costPerUnit: 6.5 },
  { id: "i4", name: "Towels", sku: "TWL-020", category: "Linen", unit: "piece", currentStock: 14, reorderLevel: 20, supplier: "Luxe Linen", costPerUnit: 3.5 }
];

export const seedBookings: Booking[] = [
  {
    id: "booking-seed-1",
    bookingCode: "AERA-1001",
    customer: { firstName: "Jessica", lastName: "Miller", email: "jessica@example.com", phone: "(626) 555-1122", type: "Returning", reminderConsent: true },
    serviceIds: ["gel-polish", "nail-art"],
    addonIds: ["french-tips"],
    technicianId: "emily",
    scheduledStartAt: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    scheduledEndAt: new Date(new Date().setHours(11, 25, 0, 0)).toISOString(),
    subtotal: 85,
    discountAmount: 0,
    taxAmount: 8.08,
    depositAmount: 23.27,
    totalAmount: 93.08,
    status: "Confirmed",
    paymentStatus: "Deposit Paid",
    notes: "Prefers almond shape.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: "booking-seed-2",
    bookingCode: "AERA-1002",
    customer: { firstName: "Amanda", lastName: "Reed", email: "amanda@example.com", phone: "(626) 555-3344", type: "New", reminderConsent: true },
    serviceIds: ["luxury-pedicure"],
    addonIds: [],
    technicianId: "sophia",
    scheduledStartAt: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    scheduledEndAt: new Date(new Date().setHours(15, 10, 0, 0)).toISOString(),
    subtotal: 72,
    discountAmount: 0,
    taxAmount: 6.84,
    depositAmount: 19.71,
    totalAmount: 78.84,
    status: "Pending",
    paymentStatus: "Deposit Pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
