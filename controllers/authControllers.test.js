import mongoose from "mongoose";
import dotenv from 'dotenv';
import request from 'supertest';

import app from '../app.js';

import { findUser } from "../services/authServices.js";

dotenv.config();
const { DB_TEST_HOST, PORT = 3000 } = process.env;

describe('test /users/login', () => {
    let server = null;
    beforeAll(async () => {
        await mongoose.connect(DB_TEST_HOST);
        server = app.listen(PORT);
    });

    afterAll(async() => {
        await mongoose.connection.close()
        server.close()
    });

    test('response should: have a status 200, return a token and a user object with fields: email, subscription of type String', async() => {
        const loginData = {
            email: 'test@mail.com',
            password: '12345678'
        };

        const { statusCode, body } = await request(app).post('/users/login').send(loginData);
        expect(statusCode).toBe(200);
        expect(body).toHaveProperty("token");

        const user = await findUser({ email: loginData.email })
        expect(user).not.toBeNull();
        expect(body.user).toEqual(
            expect.objectContaining({
                email: loginData.email,
                subscription: user.subscription,
            })
        );
    });
});