import type { TransactionalEmailKind } from "@prisma/client";

export type SmtpEncryptionMode = "STARTTLS" | "TLS" | "NONE";

export type SendTransactionalEmailInput = {
  kind: TransactionalEmailKind;
  to: string;
  subject: string;
  html: string;
  text?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
};

export type PublicSmtpSettings = {
  enabled: boolean;
  host: string | null;
  port: number | null;
  secure: boolean;
  encryptionMode: SmtpEncryptionMode;
  username: string | null;
  hasPassword: boolean;
  fromName: string | null;
  fromEmail: string | null;
  replyToEmail: string | null;
  verifiedAt: string | null;
  lastVerificationError: string | null;
  lastTestSentAt: string | null;
};

export type RuntimeSmtpConfig = {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  encryptionMode: SmtpEncryptionMode;
  requireTLS: boolean;
  username?: string;
  password?: string;
  fromName: string;
  fromEmail: string;
  replyToEmail?: string;
  verified: boolean;
};
