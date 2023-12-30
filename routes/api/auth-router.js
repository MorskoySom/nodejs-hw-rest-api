import express from "express";
import authControler from "../../controllers/auth-controler.js";

import { isNoBody, authenticate } from "../../middlewares/index.js";

import { validateBody } from "../../decorators/index.js";

import { userSignUpSchema, userSignInSchema } from "../../models/User.js";

const authRouter = express.Router();

authRouter.post("/register", isNoBody, validateBody(userSignUpSchema), authControler.signup);

authRouter.post("/login", isNoBody, validateBody(userSignInSchema), authControler.signin);

authRouter.get("/current", authenticate, authControler.getCurrent)

authRouter.post("/logout", authenticate, authControler.signout)

export default authRouter;