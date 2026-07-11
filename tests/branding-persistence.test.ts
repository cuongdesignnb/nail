import assert from "node:assert/strict";
import test from "node:test";
import { mediaAssetToPickerValue } from "../lib/media/media-picker-value";
import {
  buildBrandingContent,
  hydrateBrandingContent,
  normalizeLegacyMedia,
  verifyBrandingPersistence,
} from "../lib/settings/branding-persistence";

const oldLogo = {
  mediaId: "old-id",
  src: "/uploads/old-logo.webp",
  alt: "Old logo",
  title: "Old",
};

const newLogo = {
  mediaId: "new-id",
  src: "/uploads/new-logo.webp",
  alt: "New logo",
  title: "New",
};

test("reference mode returns a MediaReference even when the initial value is null", () => {
  const selected = mediaAssetToPickerValue(
    {
      id: "new-id",
      fileName: "new-logo.webp",
      originalName: "new-logo.png",
      url: "/uploads/new-logo.webp",
      alt: "New logo",
      title: "New",
    },
    "reference",
  );

  assert.deepEqual(selected, newLogo);
});

test("url mode remains backward compatible", () => {
  const selected = mediaAssetToPickerValue(
    {
      id: "new-id",
      fileName: "new-logo.webp",
      originalName: null,
      url: "/uploads/new-logo.webp",
      alt: null,
      title: null,
    },
    "url",
  );
  assert.equal(selected, "/uploads/new-logo.webp");
});

test("branding payload uses the selected reference instead of the old logo", () => {
  const updated = buildBrandingContent(
    { brand: { name: "Aera", logo: oldLogo, tagline: "Nails" } },
    { logo: newLogo, favicon: null },
  );
  const brand = updated.brand as Record<string, unknown>;

  assert.deepEqual(brand.logo, newLogo);
  assert.equal(brand.name, "Aera");
  assert.equal(brand.tagline, "Nails");
});

test("legacy favicon string normalizes to a canonical reference", () => {
  assert.deepEqual(normalizeLegacyMedia("/uploads/favicon.webp", "Aera favicon"), {
    mediaId: null,
    src: "/uploads/favicon.webp",
    alt: "Aera favicon",
    title: null,
  });
});

test("draft and published content must both match mediaId, src, and alt", () => {
  const draftContent = { brand: { logo: newLogo, favicon: null } };
  const publishedContent = { brand: { logo: oldLogo, favicon: null } };
  const result = verifyBrandingPersistence({
    selectedLogo: newLogo,
    selectedFavicon: null,
    draftContent,
    publishedContent,
  });

  assert.equal(result.logoMatches, false);
  assert.equal(result.matches, false);
});

test("reload hydration retains the canonical published logo", () => {
  const hydrated = hydrateBrandingContent({
    brand: { name: "Aera", logo: newLogo, favicon: null },
  });
  assert.deepEqual(hydrated.logo, newLogo);
});
