import express from "express";
import cors from "cors";
import { logger } from "./middlewares/logger.js";
import { getEnvVar } from "./utils/getEnvVar.js";;
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFoundHandler } from "./middlewares/notFoundHandler.js";
import contactRouter from "./router/contacts.js";

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(logger);

  app.use("/contact", contactRouter);

  app.use(errorHandler);
  app.use(notFoundHandler);

  const port = Number(getEnvVar("PORT", 3000)) ;

  app.listen(port, () => {
     console.log(`Server running on ${port} port`);
  });
};
