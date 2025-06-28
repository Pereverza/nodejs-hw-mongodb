import { Router } from "express";
import {
  registerController,
  loginController,
} from '../controllers/authController.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  registerUserSchema,
  loginUserSchema,
} from '../validation/authSchemas.js';

const authRouter = Router();
authRouter.post(
  '/register',
  validateBody(registerUserSchema),
  ctrlWrapper(registerController),
);
authRouter.post('/login', validateBody(loginUserSchema), loginController);
export default authRouter;
