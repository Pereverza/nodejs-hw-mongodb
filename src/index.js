import "dotenv/config";
import { setupServer } from './server.js';
import { initMongodbConnection } from './db/initMongoConnection.js';


const bootstrap = async () => {
  await initMongodbConnection();
  setupServer();
};

bootstrap();
