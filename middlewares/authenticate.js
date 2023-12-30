import jwt from "jsonwebtoken";
import { HttpError } from "../helpers/index.js";
import User from "../models/User.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
    const { authorization } = req.headers; 
    if (!authorization) {
        return next(HttpError(401, "Not 1authorized"))
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer !== "Bearer") {
        return next(HttpError(401))
    }
    try {
        const { id } = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(id);
        if (!user) {
            return next(HttpError(401))
        }
        next();
    }
    catch (error) {
        next(HttpError(401, error.message))
    }
}

export default authenticate;