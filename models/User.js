import { Schema, model } from "mongoose";
import Joi from "joi";

import { handleSaveError, addUpdateSettings } from "./hooks.js";

const emailRegexp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new Schema({
  owner: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'user',
    type: String,
    required:true,
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
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter"
  },
//   token: {
//     type: String,
//     default: null,
//   },
}, { versionKey: false, timestamps: true })

userSchema.post("save", handleSaveError);

userSchema.pre("findOneAndUpdate", addUpdateSettings);

userSchema.post("findOneAndUpdate", handleSaveError);

export const userSignUpSchema = Joi.object({
    owner: Joi.string().required(),
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(5).required(),
})

export const userSignInSchema = Joi.object({    
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(5).required(),
})

const User = model("user", userSchema);

export default User;
