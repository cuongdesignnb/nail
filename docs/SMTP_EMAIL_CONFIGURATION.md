# SMTP Email Configuration

Aera Nail Lounge sends transactional email through SMTP. Configure the primary runtime settings from:

`Admin > Settings > Email & SMTP`

Only Owner users can view, save, test, or retry email delivery.

## Recommended Ports

- `587` with STARTTLS for most providers.
- `465` with SSL/TLS when your provider requires implicit TLS.
- `None` only for trusted local development.

## Password Encryption

SMTP passwords are encrypted at rest with AES-256-GCM using `APP_SECRETS_ENCRYPTION_KEY`.

Keep `APP_SECRETS_ENCRYPTION_KEY` stable after production launch. If it changes, saved SMTP passwords can no longer be decrypted and must be re-entered by an Owner.

## Testing

1. Save SMTP settings.
2. Click `Test Connection`.
3. After verification succeeds, send a test email from the Test Email card.

Saving settings does not mark SMTP as verified. Verification is updated only after a successful transporter check.

## Delivery Logs and Retry

Recent delivery activity appears in the Email & SMTP page. Failed messages can be retried from the table.

The background retry job is:

```bash
npm run jobs:retry-transactional-emails
```

Recommended cron cadence: every 5 minutes with a lock, for example:

```bash
flock -n /tmp/aera-email-retry.lock npm run jobs:retry-transactional-emails
```

## Environment Fallback

Admin database settings are primary. Environment variables are optional bootstrap/fallback values:

```env
SMTP_HOST=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASSWORD=
SMTP_FROM_NAME=Aera Nail Lounge
SMTP_FROM_EMAIL=
SMTP_REPLY_TO=
```

## Security

- Never commit SMTP credentials.
- Never share the SMTP password.
- Never expose SMTP password through browser APIs.
- Never regenerate `APP_SECRETS_ENCRYPTION_KEY` after production launch.
