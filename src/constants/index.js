import { resolve } from "node:path";

export const sortList = ['asc', 'desc'];

export const TEMPLATES_DIR = resolve("src", "templates");

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMP_DIR = resolve("temp");

export const UPLOADS_DIR = resolve("uploads");
