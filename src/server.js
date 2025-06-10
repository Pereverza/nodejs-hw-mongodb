import express from "express";
import cors from "cors";
import  { pinoHttp } from "pino-http";
import { getEnvVar } from "./utils/getEnvVar.js";;
import { getContact, getContactId } from "./services/contact.js";

export const setupServer = () => {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(
    pinoHttp({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/contact', async (req, res) => {

      const data = await getContact();
      res.json({
        status: 200,
        message: 'Successfully found contacts!',
        data,
      });
  });
  app.get("/contact/:id", async(req, res,) => {
    const { id } = req.params;
    const data = await getContactId(id);
    if (!data) {
      return res.status(404).json({
        message: 'Contact not found',
      });
    }
    res.json({
      status: 200,
      message: `Successfull found contact with id=${id}`,
      data,
    })
  })

  app.use((error, req, res) => {
    const { status, message } = error;
    res.status(status).json({
      status,
      message,
    });
  });
  app.get((req, res) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  const port = Number(getEnvVar("PORT", 3000)) ;

  app.listen(port, () => {
     console.log(`Server running on ${port} port`);
  });
};
