import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@richardcap/common';

// Routers
import { createChargeRouter } from './routes/new';

const app = express();
const port = 3000;

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== 'test',
}));
app.use(currentUser);

// Setup route
app.use(createChargeRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

// Setup error handler middleware
app.use(errorHandler);

export {app, port};