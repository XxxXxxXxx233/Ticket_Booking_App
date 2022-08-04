import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';

// Models
import { User } from '../models/user';

// Middlewares
import { validateRequest } from '../middlewares/validate_request';

// Errors
import { BadRequestError } from '../errors/bad_request_error';

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
    validateRequest,
    async (req: Request, res: Response) => {
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
    }
);

export { router as signupRouter };