import { prisma } from "@/lib/db";
import type { BusinessSettings } from "./settings.types";

export function getBusinessSettingsRecord() {
  return prisma.businessSetting.upsert({
    where: { key: "default" },
    update: {},
    create: { key: "default" },
  });
}

export function saveBusinessSettingsRecord(data: BusinessSettings) {
  return prisma.businessSetting.upsert({
    where: { key: "default" },
    update: data,
    create: { key: "default", ...data },
  });
}

