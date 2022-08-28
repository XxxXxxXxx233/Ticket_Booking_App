import mongoose from 'mongoose';
import {app, port} from './app';

const start = async() => {
    console.log('Starting up...');
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined');
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to database`);
    } catch (err) {
        console.error(err);
    }
    app.listen(port, () => {
        console.log(`Auth service on port ${port}!`)
    });
};

start();