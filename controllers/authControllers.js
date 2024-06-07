import fs from 'fs/promises';
import path from 'path';

import 'dotenv/config';
import { nanoid } from 'nanoid';
import gravatar from 'gravatar';
import Jimp from "jimp";

import * as authServices from '../services/authServices.js';

import HttpError from '../helpers/HttpError.js';
import compareHash from '../helpers/compareHash.js';
import transport from '../helpers/transport.js';
import ctrlWrapper from "../decorators/controllerWrapper.js";

import { createToken } from '../helpers/jwt.js';

const { META_FROM, BASE_URL } = process.env;

const verificationToken = nanoid();

const avatarPath = path.resolve('public', 'avatars');

const signup = async(req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if(user) {
        throw HttpError(409, 'Email in use');
    }
    const avatarURL = gravatar.url(email, {protocol: 'https', s: '250'});
    const newUser = await authServices.saveUser({ ...req.body, verificationToken, avatarURL });

    const verifyEmail = {
        from: META_FROM,
        to: email,
        subject: 'Verify email',
        html: `<div>
                  <a
                    target="_blank"
                    href="${BASE_URL}/api/users/verify/${verificationToken}"
                    style="
                      box-sizing: border-box;
                      display: block;
                      width: 160px;
                      height: 50px;
                      padding: 12px;
                      margin: auto;
                      text-decoration: none;
                      background-color: #13AA52;
                      border: 1px solid #212121;
                      border-radius: 4px;
                      text-align: center;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      font-size: 18px;
                      color: #ffffff;"
                  >
                    Verify Email
                  </a>
                </div>`,
    };
    await transport
        .sendMail(verifyEmail)
        .then(() => console.log('Email send success'))
        .catch(error => console.log(error.message));
    res.status(201).json({
        user: {
            email,
            subscription: newUser.subscription,
            avatarURL: newUser.avatarURL,
        }
    });
};

const verifyEmail = async (req, res) => {
    const { verificationToken } = req.params;
    const user = await authServices.findUser({ verificationToken });
    if (!user) {
        throw HttpError(404, 'User not found');
    }
    await authServices.updateUserStatus(user._id, { verify: true, verificationToken: 'null' });
    res.json({
        message: 'Verification successful',
    });
};

const resendVerify = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        throw HttpError(400, "missing required field email");
    }
    const user = await authServices.findUser({ email });
    if (!user) {
        throw HttpError(404, "Email not found");
    }
    if (user.verify) {
        throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
        from: META_FROM,
        to: email,
        subject: 'Verify email',
        html: `<div>
                  <a
                    target="_blank"
                    href="${BASE_URL}/api/users/verify/${verificationToken}"
                    style="
                      box-sizing: border-box;
                      display: block;
                      width: 160px;
                      height: 50px;
                      padding: 12px;
                      margin: auto;
                      text-decoration: none;
                      background-color: #13AA52;
                      border: 1px solid #212121;
                      border-radius: 4px;
                      text-align: center;
                      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                      font-size: 18px;
                      color: #ffffff;"
                  >
                    Verify Email
                  </a>
                </div>`,
    };
    await transport
        .sendMail(verifyEmail)
        .then(() => console.log('Email send success'))
        .catch(error => console.log(error.message));
    res.json({ message: "Verification email sent" });
};

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if(!user) {
        throw HttpError(401, 'Email or password is wrong');
    }
    if (!user.verify) {
        throw HttpError(401, `Your email ${email} is not verified`);
    }
    const comparePassword = await compareHash(password, user.password);
    if(!comparePassword){
        throw HttpError(401, 'Email or password is wrong');
    }
    const { _id: id } = user;
    const payload = {
        id,
    };
    const token = createToken(payload);
    await authServices.updateUser({ _id: id }, { token });
    res.json({
        token,
        user: {
            email,
            subscription: user.subscription,
        }
    });
};

const getCurrent = (req, res) => {
    const { email, subscription } = req.user;
    res.json({
        email,
        subscription,
    });
};

const logout = async(req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: '' });
    res.status(204).json();
};

const updateSubscription = async (req, res) => {
    const { id: _id } = req.params;
    const { username, email } = req.user;
    const result = await authServices.updateUserStatus({ _id }, req.body);
    if (!result) {
        throw HttpError(404, `User with id=${id} not found`);
    }
    res.json({
        username,
        email,
        subscription: result.subscription,
    });
};

const updateAvatar = async (req, res) => {
    const { _id } = req.user;
    if (!req.file) {
        return res.status(400).json({ message: 'File is required' });
    }
    const { path: oldPath, filename } = req.file;
    const newPath = path.join(avatarPath, filename);
    try {
        await fs.rename(oldPath, newPath);
        const avatar = await Jimp.read(newPath);
        avatar.resize(250, 250);
        await avatar.writeAsync(newPath);
        const avatarURL = path.join('avatars', filename).replace(/\\/g, '/');
        const updatedUser = await authServices.updateUser({ _id }, { avatarURL });
        if (!updatedUser) {
            throw HttpError(401, 'Not authorized');
        }
        res.json({
            avatarURL: updatedUser.avatarURL,
        });
    } catch (error) {
        throw HttpError(401, 'Not authorized');
    };
};

export default {
    signup: ctrlWrapper(signup),
    verifyEmail: ctrlWrapper(verifyEmail),
    resendVerify: ctrlWrapper(resendVerify),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
    updateAvatar: ctrlWrapper(updateAvatar),
};