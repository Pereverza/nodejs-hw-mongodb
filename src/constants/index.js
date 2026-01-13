import { resolve } from "node:path";
import path from 'node:path';

export const sortList = ['asc', 'desc'];

export const TEMPLATES_DIR = resolve("src", "templates");

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};

export const TEMP_DIR = path.join(process.cwd(), 'src', 'temp');
export const UPLOAD_DIR = path.join(process.cwd(), 'uploads');


export const CLOUDINARY = {
  CLOUD_NAME: 'CLOUDINARY_CLOUD_NAME',
  API_KEY: 'CLOUDINARY_API_KEY',
  API_SECRET: 'CLOUDINARY_API_SECRET',
};

export const SWAGGER_PATH = resolve("docs", "swagger.json");
