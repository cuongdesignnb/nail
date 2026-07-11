export type AdminSettingsResponse<T> = {
  success: true;
  data: T;
  meta: {
    version?: number;
    updatedAt?: string | null;
    updatedBy?: string | null;
  };
};

export type AdminSettingsErrorCode =
  | "VALIDATION_ERROR"
  | "VERSION_CONFLICT"
  | "DATABASE_ERROR"
  | "UNAUTHORIZED"
  | "PERSISTENCE_VERIFICATION_FAILED";

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

