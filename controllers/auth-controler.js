import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import gravatar from 'gravatar';
import path from "path";
import fs from "fs/promises";
import Jimp from 'jimp';
import { nanoid } from "nanoid";

import User from "../models/User.js";

import { HttpError, sendEmail } from "../helpers/index.js"
import { ctrlWrapper } from "../decorators/index.js"

const { JWT_SECRET, BASE_URL } = process.env;

const avatarsDir = path.resolve("public", "avatars");

const signup = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        throw HttpError(409, "Email in use")
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();

    const avatarURL = gravatar.url(email);

    const newUser = await User.create({ ...req.body, avatarURL, password: hashPassword, verificationToken });
    
    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    res.json({
        username: newUser.username,
        email: newUser.email,
    })
}

const signin = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(401, "Email or password is wrong");
    }

    if (!user.verify) {
        throw HttpError(400, 'Email not verify')
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
        owner: user.owner,
        email: user.email,
    })
}

const verify = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken });
    if (!user) {
        throw HttpError(404, 'User not found or already verify')
    }
    await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: "" })
    
    res.status(200).json({
        message: "Verification successful"
    })
}

const resendVerifyEmail = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }

    const verifyEmail = {
        to: email,
        subject: "Verify email",
        html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click to verify email</a>`
    }

    await sendEmail(verifyEmail);

    // res.status(200).json({
    //     message: "Verification email sent"
    // })
    res.json({
        username: user.username,
        email: user.email,
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

    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' })
    }

    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);

    const image = await Jimp.read(tempUpload);

    await image.resize(250, 250);

    await image.write(resultUpload);

    await fs.unlink(tempUpload);   

    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({
        avatarURL,
    })
}

export default {
    signup: ctrlWrapper(signup),
    signin: ctrlWrapper(signin),
    verify: ctrlWrapper(verify),
    resendVerifyEmail: ctrlWrapper(resendVerifyEmail),
    getCurrent: ctrlWrapper(getCurrent),
    signout: ctrlWrapper(signout),
    updateAvatar: ctrlWrapper(updateAvatar),
}