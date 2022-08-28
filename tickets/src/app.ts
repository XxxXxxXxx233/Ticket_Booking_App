import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@richardcap/common';

// Routers
import { createTicketRouter } from './routes/new';
import { showTicketRoueter } from './routes/show';
import { indexTicketRouter } from './routes/index';
import { updateTicketRouter } from './routes/update';

const app = express();
const port = 3000;

app.set('trust proxy', true);
app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false
}));
app.use(currentUser);

// Setup route
app.use(createTicketRouter);
app.use(showTicketRoueter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

// Setup error handler middleware
app.use(errorHandler);

export {app, port};