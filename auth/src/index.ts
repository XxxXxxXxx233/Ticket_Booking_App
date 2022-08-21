import mongoose from 'mongoose';
import {app, port} from './app';

const start = async() => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }

    const dbName = 'auth';
    try {
        await mongoose.connect(`mongodb://auth-mongo-srv:27017/${dbName}`);
        console.log(`Connected to ${dbName} database`);
    } catch (err) {
        console.error(err);
    }
    app.listen(port, () => {
        console.log(`Auth service on port ${port}!`)
    });
};

start();