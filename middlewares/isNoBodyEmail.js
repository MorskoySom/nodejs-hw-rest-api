import { HttpError } from "..//helpers/index.js";

const isNoBodyEmail = (req, res, next) => {
    const { length } = Object.keys(req.body);
    if (!length) {
        return next(HttpError (400, "missing required field email"))
    }
    next();
}

export default isNoBodyEmail;