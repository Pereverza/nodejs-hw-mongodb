import { Router} from "express"
import {
  getContactByIdController,
  getContactController,
  addContactController,
  upsertContactByIdController,
    patchContactByIdController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactRouter = Router();

contactRouter.get('/',ctrlWrapper (getContactController));

contactRouter.get('/:id', ctrlWrapper (getContactByIdController));

contactRouter.post("/", ctrlWrapper(addContactController));

contactRouter.put("/:id", ctrlWrapper(upsertContactByIdController));

contactRouter.patch("/:id", ctrlWrapper(patchContactByIdController));

contactRouter.delete("/:id", ctrlWrapper(deleteContactByIdController));

export default contactRouter;
