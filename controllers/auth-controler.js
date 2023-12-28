import User from "../models/User.js"

import { HttpError } from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js"

const signUp = async (req, res) => {
    const newUser = await User.create(req.body);

    res.json({
        owner: newUser.owner,
        email: newUser.email,
    })
}


export default {
    signUp: ctrlWrapper(signUp),
}