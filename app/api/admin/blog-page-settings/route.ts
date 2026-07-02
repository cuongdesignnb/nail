import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { blogPageSettingSchema } from "@/lib/validations/blog.validation";

export async function GET() {
  try {
    let settings = await prisma.blogPageSetting.findFirst();
    if (!settings) {
      // create default settings record
      settings = await prisma.blogPageSetting.create({
        data: {
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
    }
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("GET admin/blog-page-settings error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const json = await req.json();
    const body = blogPageSettingSchema.parse(json);

    const first = await prisma.blogPageSetting.findFirst();

    let settings;
    if (first) {
      settings = await prisma.blogPageSetting.update({
        where: { id: first.id },
        data: body,
      });
    } else {
      settings = await prisma.blogPageSetting.create({
        data: body,
      });
    }

    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    console.error("PUT admin/blog-page-settings error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json({ success: false, errors: error.format() }, { status: 400 });
    }
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
