import type { ReactNode } from "react";
import { getPublishedPublicShellData } from "@/lib/site-shell/public-shell.service";
import type { PublicShellMode } from "@/lib/site-shell/public-shell.types";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";

export async function PublicSiteShell({ children, mode = "published" }: { children: ReactNode; mode?: PublicShellMode }) {
  const shellData = await getPublishedPublicShellData(mode);
  return (
    <>
      {mode === "draft-preview" && (
        <div className="aera-public-preview-banner">
          <strong>Draft Preview</strong>
          <span>This preview shows unpublished Header, Footer and page changes.</span>
        </div>
      )}
      <PublicHeader data={shellData} />
      {children}
      <PublicFooter data={shellData} />
    </>
  );
}
