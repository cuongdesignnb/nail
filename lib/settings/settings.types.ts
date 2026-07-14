export type AdminSettingsResponse<T> = {
  success: true;
  data: T;
  meta: {
    version?: number;
    updatedAt: string;
    updatedBy: string | null;
    publicRevalidated: boolean;
  };
};

export type AdminSettingsErrorCode =
  | "VALIDATION_ERROR"
  | "VERSION_CONFLICT"
  | "DATABASE_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "PERSISTENCE_VERIFICATION_FAILED"
  | "PUBLIC_REVALIDATION_FAILED";

export type AdminSettingsError = {
  success: false;
  error: string;
  code: AdminSettingsErrorCode;
  issues?: Record<string, string[]>;
};

export type BusinessSettings = {
  timezone: string;
  currency: string;
};

export type BusinessHour = {
  day: string;
  isOpen: boolean;
  startTime: string;
  endTime: string;
};

export type BookingPolicies = {
  minAdvanceHours: number;
  maxAdvanceDays: number;
  cancellationWindowHours: number;
  bufferMinutes: number;
};

export type SalonProfileSettings = {
  name: string;
  phone: string;
  email: string;
  address: string;
  website: string;
  description: string;
};

export type BrandingSettings = {
  logo: import("@/lib/media/media.types").MediaReference | null;
  favicon: import("@/lib/media/media.types").MediaReference | null;
};

export type GlobalSettingsSection =
  | "salon-profile"
  | "business-hours"
  | "booking-policies"
  | "branding";
