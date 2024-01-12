import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from 'gravatar';
import path from "path";
import fs from "fs/promises";
import Jimp from 'jimp';

import User from "../models/User.js";

import { HttpError } from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js"

const { JWT_SECRET } = process.env;

const avatarsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({...req.body, avatarURL, password: hashPassword});

    res.json({
        owner: newUser.owner,
        email: newUser.email,
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw HttpError(401, "Email or password is wrong");
    }

    const { _id: id } = user;
    const payload = {
        id
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(id, { token });

    res.json({
        token,
    })
}

const getCurrent = async (req, res) => {
    const { owner, email } = req.user;

    res.json({
        owner,
        email,
    })    
}

const signout = async (req, res) => {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json("")
}

const updateAvatar = async (req, res) => {
    const { _id } = req.user;

    const { path: tempUpload, originalname } = req.file;

    
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);

    await image.resize(250, 250);

    await image.write(resultUpload);

    await fs.unlink(tempUpload);

    // await fs.rename(tempUpload, resultUpload);

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
}