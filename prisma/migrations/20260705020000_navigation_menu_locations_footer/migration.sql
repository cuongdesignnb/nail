CREATE TABLE "NavigationMenu" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT NOT NULL,
    "draftItems" JSONB NOT NULL,
    "publishedItems" JSONB,
    "version" INTEGER NOT NULL DEFAULT 1,
    "updatedBy" TEXT,
    "publishedBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationMenu_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "NavigationMenuSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "headerMobileMode" TEXT NOT NULL DEFAULT 'inherit_header_primary',
    "headerMobileMenuKey" TEXT,
    "footerLayout" TEXT NOT NULL DEFAULT 'four_columns',
    "footerShowSocial" BOOLEAN NOT NULL DEFAULT true,
    "footerShowLegal" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NavigationMenuSetting_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "NavigationMenu_key_key" ON "NavigationMenu"("key");
CREATE UNIQUE INDEX "NavigationMenu_location_key" ON "NavigationMenu"("location");
CREATE INDEX "NavigationMenu_location_idx" ON "NavigationMenu"("location");
CREATE UNIQUE INDEX "NavigationMenuSetting_key_key" ON "NavigationMenuSetting"("key");
