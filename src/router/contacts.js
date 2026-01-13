import { Router } from 'express';
import {
  getContactByIdController,
  getContactController,
  addContactController,
  upsertContactByIdController,
  patchContactByIdController,
  deleteContactByIdController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/upload.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', ctrlWrapper(getContactController));

contactRouter.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(addContactController),
);


contactRouter.put(
  '/:id',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(upsertContactByIdController),
);


contactRouter.patch(
  '/:id',
  upload.single('photo'),
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);

contactRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(deleteContactByIdController),
);

export default contactRouter;
