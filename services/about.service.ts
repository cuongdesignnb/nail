import { getPublishedAboutPageContent } from "@/lib/services/about-content.service";
import { AboutPageContent } from "@/types/about";

export async function fetchAboutPageContent(): Promise<AboutPageContent> {
  return getPublishedAboutPageContent();
}
