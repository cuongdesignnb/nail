import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import type { RuntimeSmtpConfig } from "./mail.types";

export function createSmtpTransporter(config: RuntimeSmtpConfig) {
  const options: SMTPTransport.Options = {
    host: config.host,
    port: config.port,
    secure: config.secure,
    requireTLS: config.requireTLS,
    auth: config.username || config.password ? {
      user: config.username,
      pass: config.password,
    } : undefined,
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
    tls: {
      servername: config.host,
      minVersion: "TLSv1.2",
    },
  };
  return nodemailer.createTransport(options);
}
