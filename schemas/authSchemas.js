import Joi from 'joi';
import { emailRegexp } from '../constants/user-constants.js';

export const authSignupSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(8).required(),
});

export const authLoginSchema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(8).required(),
});

export const subscriptionSchema = Joi.object({
    subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});