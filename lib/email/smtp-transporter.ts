import nodemailer from "nodemailer";
import type { RuntimeSmtpConfig } from "./mail.types";

export function createSmtpTransporter(config: RuntimeSmtpConfig) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.username || config.password ? {
      user: config.username,
      pass: config.password,
    } : undefined,
  });
}
