import "dotenv/config";
import { setupServer } from './server.js';
import { initMongodbConnection } from './db/initMongoConnection.js';

console.log('ENV Vars:', process.env);
const bootstrap = async () => {
  await initMongodbConnection();
  setupServer();
};

bootstrap();

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};
