import mongoose from 'mongoose';
import {app, port} from './app';
import { natsWrapper } from './nats_wrapper';

const start = async() => {
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY is not defined');
    }
    if (!process.env.MONGO_URI) {
        throw new Error('MONGO_URI is not defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL is not defined');
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_CLUSTER_ID is not defined');
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID is not defined');
    }

    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed!');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        await mongoose.connect(process.env.MONGO_URI);
        console.log(`Connected to database`);
    } catch (err) {
        console.error(err);
    }
    app.listen(port, () => {
        console.log(`Ticket service on port ${port}!`)
    });
};

start();