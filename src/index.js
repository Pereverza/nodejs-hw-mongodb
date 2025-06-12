import "dotenv/config";
import { setupServer } from './server.js';
import { initMongodbConnection } from './db/initMongoConnection.js';

console.log('ENV Vars:', process.env);
const bootstrap = async () => {
  await initMongodbConnection();
  setupServer();
};

bootstrap();
