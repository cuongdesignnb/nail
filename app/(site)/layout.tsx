import { PublicSiteShell } from "@/components/public/shell/PublicSiteShell";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <PublicSiteShell>{children}</PublicSiteShell>;
}
