import { unstable_cache } from "next/cache";
import { defaultAboutContent } from "@/data/about.default";
import { getDraftContent, getPublishedContent } from "@/lib/content/content.repository";
import type { AboutPageContent } from "@/types/about";

export const getPublishedAboutPageContent = unstable_cache(
  async () => {
    try {
      return await getPublishedContent("about") as unknown as AboutPageContent;
    } catch (error) {
      console.error("Unable to load published About content. Falling back to default.", error);
      return defaultAboutContent;
    }
  },
  ["about-page"],
  { tags: ["about-page"], revalidate: 60 }
);

export async function getDraftAboutPageContent() {
  return getDraftContent("about") as Promise<unknown> as Promise<AboutPageContent>;
}
