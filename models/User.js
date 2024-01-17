import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, addUpdateSettings } from "./hooks.js";

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
  username: {
    type: String    
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 5,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    match: emailRegexp,
  },
  avatarURL: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
  token: {
    type: String,
    default: null,
  },
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
  }
}, { versionKey: false, timestamps: true })

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignUpSchema = Joi.object({
    username: Joi.string(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(5).required(),
})

export const userSignInSchema = Joi.object({    
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(5).required(),
})

const User = model("user", userSchema);

export default User;
