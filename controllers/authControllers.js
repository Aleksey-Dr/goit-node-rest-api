import * as authServices from '../services/authServices.js';

import HttpError from '../helpers/HttpError.js';
import compareHash from '../helpers/compareHash.js';
import ctrlWrapper from "../decorators/controllerWrapper.js";

import { createToken } from '../helpers/jwt.js';

const signup = async(req, res) => {
    const { email } = req.body;
    const user = await authServices.findUser({ email });
    if(user) {
        throw HttpError(409, 'Email in use');
    }
    const newUser = await authServices.saveUser(req.body);
    res.status(201).json({
        username: newUser.username,
        email: newUser.email,
        subscription: newUser.subscription
    });
};

const login = async(req, res) => {
    const { email, password } = req.body;
    const user = await authServices.findUser({ email });
    if(!user) {
        throw HttpError(401, 'Email or password is wrong');
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
    });
};

const getCurrent = (req, res) => {
    const { username, email } = req.user;
    res.json({
        username,
        email,
    });
};

const logout = async(req, res) => {
    const { _id } = req.user;
    await authServices.updateUser({ _id }, { token: '' });
    res.json({
        massage: 'Logout success'
    })
};

const updateSubscription = async (req, res) => {
    const { id: _id } = req.params;
    const { username, email, subscription } = req.user;
    const result = await authServices.updateStatusSubscription({ _id }, req.body);
    if (!result) {
      throw HttpError(404, `User with id=${id} not found`);
    }
    res.json({
        username,
        email,
        subscription: result.subscription,
    });
};

export default {
    signup: ctrlWrapper(signup),
    login: ctrlWrapper(login),
    getCurrent: ctrlWrapper(getCurrent),
    logout: ctrlWrapper(logout),
    updateSubscription: ctrlWrapper(updateSubscription),
};