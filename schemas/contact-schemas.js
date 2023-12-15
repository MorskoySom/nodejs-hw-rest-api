import Joi from "joi";

export const contactAddSchema = Joi.object({
    name: Joi.string().required().messages({
    'any.required': 'missing required name field',
    'string.empty': 'name field could not be empty',
  }),
    email: Joi.string().required().messages({
    'any.required': 'missing required email field',
    'string.empty': 'email field could not be empty',
  }),
    phone: Joi.string().required().messages({
    'any.required': 'missing required phone field',
    'string.empty': 'phone field could not be empty',
    // 'string.pattern.base': 'phone field should contain only numbers',
  }),
    
})

export const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string().pattern(/\d+/),
    
})