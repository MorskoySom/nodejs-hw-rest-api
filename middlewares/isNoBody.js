import { HttpError } from "..//helpers/index.js";

const isNoBody = (req, res, next) => {
    const { length } = Object.keys(req.body);
    if (!length) {
        return next(HttpError (400, "missing required name field"))
    }
    next();
}

export default isNoBody;