import Joi from 'joi';

export const createContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    'string.min': 'Name must be at least 3 characters.',
    'string.max': 'Name must be at most 20 characters.',
    'any.required': 'Name is required.',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?\d+$/)
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.pattern.base': 'Phone number must contain only digits.',
      'string.min': 'Phone number must be at least 3 characters.',
      'string.max': 'Phone number must be at most 20 characters.',
      'any.required': 'Phone number is required.',
    }),
  email: Joi.string().required().min(3).max(30).email().allow(null).messages({
    'string.email': 'Email must be a valid email address.',
    'string.min': 'Email must be at least 3 characters.',
    'string.max': 'Email must be at most 20 characters.',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .required()
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal.',
      'any.required': 'Contact type is required.',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.min': 'Name must be at least 3 characters.',
    'string.max': 'Name must be at most 20 characters.',

  }),
  phoneNumber: Joi.string()
    .pattern(/^\d+$/)
    .min(3)
    .max(20)
    .messages({
      'string.pattern.base': 'Phone number must contain only digits.',
      'string.min': 'Phone number must be at least 3 characters.',
      'string.max': 'Phone number must be at most 20 characters.',
    }),
  email: Joi.string().min(3).max(30).email().allow(null).messages({
    'string.email': 'Email must be a valid email address.',
    'string.min': 'Email must be at least 3 characters.',
    'string.max': 'Email must be at most 20 characters.',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .messages({
      'any.only': 'Contact type must be one of: work, home, personal.'
    }),
});
