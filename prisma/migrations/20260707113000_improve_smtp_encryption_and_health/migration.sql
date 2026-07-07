-- Add an explicit SMTP encryption mode while keeping the legacy secure boolean
-- for backwards compatibility with already-saved settings.
ALTER TABLE "EmailSmtpSetting"
ADD COLUMN IF NOT EXISTS "smtpEncryptionMode" TEXT NOT NULL DEFAULT 'STARTTLS';

UPDATE "EmailSmtpSetting"
SET "smtpEncryptionMode" = CASE
  WHEN "secure" = true THEN 'TLS'
  ELSE 'STARTTLS'
END
WHERE "smtpEncryptionMode" IS NULL OR "smtpEncryptionMode" = 'STARTTLS';
