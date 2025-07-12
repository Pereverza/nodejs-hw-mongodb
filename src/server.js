import express from "express";
import cors from "cors";
import { logger } from "./middlewares/logger.js";
import { getEnvVar } from "./utils/getEnvVar.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import contactRouter from "./router/contacts.js";
import authRouter from "./router/auth-router.js";
import cookieParser from 'cookie-parser';
import { UPLOAD_DIR } from './constants/index.js';
import { swaggerDocs } from "./middlewares/swaggerDocs.js";

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use('/uploads', express.static(UPLOAD_DIR));
  app.use(cookieParser());
  app.use(logger);

  app.use("/api-docs", swaggerDocs());

app.use('/auth', authRouter);
  app.use("/contacts", contactRouter);

  app.use(errorHandler);
  app.use(notFoundHandler);

  const port = Number(getEnvVar("PORT", 3000)) ;

  app.listen(port, () => {
     console.log(`Server running on ${port} port`);
  });
};
