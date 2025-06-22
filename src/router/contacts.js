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
import { validateBody } from "../utils/validateBody.js";
import { createContactSchema, updateContactSchema } from "../validation/contact.js";
import { isValidId } from '../middlewares/isValidId.js';

const contactRouter = Router();

contactRouter.get('/',ctrlWrapper (getContactController));

contactRouter.get('/:id', isValidId, ctrlWrapper (getContactByIdController));

contactRouter.post("/",validateBody(createContactSchema), ctrlWrapper(addContactController));

contactRouter.put("/:id", isValidId, validateBody(updateContactSchema), ctrlWrapper(upsertContactByIdController));

contactRouter.patch(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);

contactRouter.delete("/:id",isValidId, ctrlWrapper(deleteContactByIdController));

export default contactRouter;
