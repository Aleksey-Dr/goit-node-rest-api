import express from 'express';

import authControllers from '../controllers/authControllers.js';
import isEmptyBody from '../middlewares/isEmptyBody.js';
import validateBody from '../helpers/validateBody.js';
import isValidId from '../middlewares/isValidId.js';
import authenticate from '../middlewares/authenticate.js';

import { authSignupSchema, authLoginSchema, subscriptionSchema } from '../schemas/authSchemas.js';

const authRouter = express.Router();

authRouter.post('/register', isEmptyBody, validateBody(authSignupSchema), authControllers.signup);

authRouter.post('/login', isEmptyBody, validateBody(authLoginSchema), authControllers.login);

authRouter.get('/current', authenticate, authControllers.getCurrent);

authRouter.post('/logout', authenticate, authControllers.logout);

authRouter.patch('/:id/subscription', isValidId, authenticate, validateBody(subscriptionSchema), authControllers.updateSubscription);

export default authRouter;