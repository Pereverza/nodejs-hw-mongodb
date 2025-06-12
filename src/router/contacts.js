import { Router} from "express"
import { getContactByIdController, getContactController } from "../controllers/contacts.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";

const contactRouter = Router();

contactRouter.get('/',ctrlWrapper (getContactController));

contactRouter.get('/:id', ctrlWrapper (getContactByIdController));

export default contactRouter;
