import type { PublicShellData } from "./public-shell.types";

export function validatePublicShellData(data: PublicShellData) {
  const warnings: string[] = [];
  if (!data.brand.name) warnings.push("Brand name is missing.");
  if (!data.brand.logo?.src) warnings.push("Brand logo media source is missing.");
  if (!data.brand.logo?.alt) warnings.push("Brand logo alt text is missing.");
  return {
    valid: warnings.length === 0,
    warnings,
  };
}
