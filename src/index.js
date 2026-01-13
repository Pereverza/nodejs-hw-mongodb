import { initMongodbConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';
import { createDirIfNotExists } from './utils/createDirIfNotExists.js';
import { TEMP_DIR, UPLOAD_DIR } from './constants/index.js';

const bootstrap = async () => {
  await initMongodbConnection();
  await createDirIfNotExists(TEMP_DIR);
  await createDirIfNotExists(UPLOAD_DIR);
  setupServer();
};

void bootstrap();
