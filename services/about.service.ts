import { defaultAboutContent } from "@/data/about.default";
import { AboutPageContent } from "@/types/about";

export async function fetchAboutPageContent(): Promise<AboutPageContent> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/mock/about`, {
      next: {
        revalidate: 60,
      },
    });

    if (!res.ok) return defaultAboutContent;

    const json = await res.json();

    return json?.data || defaultAboutContent;
  } catch (error) {
    console.error("Error fetching about page content, falling back to default data:", error);
    return defaultAboutContent;
  }
}
