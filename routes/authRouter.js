import express from 'express';

import authControllers from '../controllers/authControllers.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../helpers/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../middlewares/upload.js';

import { authSignupSchema, emailSchema, authLoginSchema, subscriptionSchema } from '../schemas/authSchemas.js';

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(authSignupSchema), authControllers.signup);

authRouter.get('/verify/:verificationToken', authControllers.verifyEmail);

authRouter.post('/verify', validateBody(emailSchema), authControllers.resendVerify);

authRouter.post('/login', isEmptyBody, validateBody(authLoginSchema), authControllers.login);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post('/logout', authenticate, authControllers.logout);

authRouter.patch('/subscription', isValidId, authenticate, validateBody(subscriptionSchema), authControllers.updateSubscription);

authRouter.patch("/avatars", authenticate, upload.single('avatar'), authControllers.updateAvatar);

export default authRouter;