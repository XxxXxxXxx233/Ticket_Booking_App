/// <reference types="node" /> 

import nats, { Message } from 'node-nats-streaming';
import { randomBytes } from 'crypto';

console.clear();

const stan = nats.connect('ticketing', randomBytes(4).toString('hex'), {
    url: 'http://localhost:4222'
});

stan.on('connect', () => {
    console.log('Publisher connected to NATS');

    const data = {
        id: '123',
        title: 'concert',
        price: 20
    };
    stan.publish('ticket:created', JSON.stringify(data), () => {
        console.log('Event published');
    })
});