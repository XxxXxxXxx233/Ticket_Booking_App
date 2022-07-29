import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';

// Routers
import { signinRouter } from './routes/signin';
import { signoutRouter } from './routes/signout';
import { signupRouter } from './routes/signup';
import { currentUserRouter } from './routes/current_user';

// Middlewares
import { errorHandler } from './middlewares/error_handler';
import { NotFoundError } from './errors/not_found_error';

const app = express();
const port = 3000;

app.use(json());

// Setup route
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);
app.use(currentUserRouter);

app.all('*', async (req, res, next) => {
    throw new NotFoundError();
});

// Setup middleware
app.use(errorHandler);

app.listen(port, () => {
    console.log(`Listening on port ${port}!`)
});