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

// upload.fields([
//   { name: 'poster', maxCount: 1 },
//   { name: 'subposters', maxCount: 10}]);
// upload.array("poster", 8);
contactRouter.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(addContactController),
);

contactRouter.put(
  '/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(upsertContactByIdController),
);

contactRouter.patch(
  '/:id',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactByIdController),
);

contactRouter.delete(
  '/:id',
  isValidId,
  ctrlWrapper(deleteContactByIdController),
);

export default contactRouter;
