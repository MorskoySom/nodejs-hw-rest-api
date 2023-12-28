import express from "express";
import authControler from "../../controllers/auth-controler.js";

import { isNoBody, isCorrectId, isNoBodyFavorite } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import { userSignUpSchema, userSignInSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/signup", isNoBody, validateBody(userSignUpSchema), authControler.signup);

authRouter.post("/signin", isNoBody, validateBody(userSignInSchema), authControler.signin);

export default authRouter;