import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, addUpdateSettings } from "./hooks.js";

const contactSchema = new Schema({    
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },  
})

contactSchema.post("save", handleSaveError);

contactSchema.pre("findOneAndUpdate", addUpdateSettings);

contactSchema.post("findOneAndUpdate", handleSaveError);


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
  }),
    favorite: Joi.boolean(),    
})

export const contactUpdateSchema = Joi.object({
    name: Joi.string(),
    email: Joi.string(),
    phone: Joi.string().pattern(/\d+/),
    favorite: Joi.boolean(),
    
})

export const contactUpdateFavoriteSchema = Joi.object({
    favorite: Joi.boolean().required()
})

const Contact = model("contact", contactSchema);

export default Contact;