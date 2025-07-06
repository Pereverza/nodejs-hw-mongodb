import { Router } from "express";
import {
  registerController,
  verifyController,
  loginController,
  refreshController,
  logoutController,
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
authRouter.get("/verify", ctrlWrapper(verifyController));
authRouter.post('/login', validateBody(loginUserSchema), loginController);

authRouter.post("/refresh", ctrlWrapper(refreshController));

authRouter.post('/logout', ctrlWrapper(logoutController));

export default authRouter;
