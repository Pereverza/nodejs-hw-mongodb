import Joi from "joi";
import { emailRegexp } from '../constants/authConstant.js';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});
export const requestResetEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
export const resetPasswordSchema = Joi.object({
  password: Joi.string().min(6).required(),
  token: Joi.string().required(),
});
