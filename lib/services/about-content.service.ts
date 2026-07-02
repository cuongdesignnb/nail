import { unstable_cache } from "next/cache";
import { defaultAboutContent } from "@/data/about.default";
import { getDraftAboutContent, getPublishedAboutContent } from "@/lib/repositories/about-content.repository";

export const getPublishedAboutPageContent = unstable_cache(
  async () => {
    try {
      return await getPublishedAboutContent();
    } catch (error) {
      console.error("Unable to load published About content. Falling back to default.", error);
      return defaultAboutContent;
    }
  },
  ["about-page"],
  { tags: ["about-page"], revalidate: 60 }
);

export async function getDraftAboutPageContent() {
  return getDraftAboutContent();
}
