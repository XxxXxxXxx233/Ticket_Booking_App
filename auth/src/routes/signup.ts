import express, { Request, Response } from 'express'
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

import { User } from '../models/user';

import { BadRequestError } from '../errors/bad_request_error';
import { RequestValidationError } from '../errors/request_validation_error';
import { DatabaseConnectionError } from '../errors/database_connection_error';

const router = express.Router();

router.post(
    '/api/users/signup', 
    [
        body('email')
            .isEmail()
            .withMessage('Invalid email'),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Password must be between 4 and 20 characters')
    ], 
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

        const { email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (existingUser) {
            throw new BadRequestError('Email is used');
        }

        const user = User.build({
            email,
            password
        });
        await user.save();
        // Generate JWT and store it in req.sesson
        const userJwt = jwt.sign(
            {
                id: user.id,
                email: user.email
            }, 
            process.env.JWT_KEY!
        );
        req.session = {
            jwt: userJwt
        };

        res.status(201).send(user);
});

export { router as signupRouter };