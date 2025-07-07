import "dotenv/config";
import { setupServer } from './server.js';
import { initMongodbConnection } from './db/initMongoConnection.js';
import { createDirNotExists } from "./utils/createDirNotExists.js";
import { TEMP_DIR, UPLOADS_DIR } from "./constants/index.js";

const bootstrap = async () => {
  await initMongodbConnection();
  setupServer();
  await createDirNotExists(TEMP_DIR);
  await createDirNotExists(UPLOADS_DIR);
};

bootstrap();


