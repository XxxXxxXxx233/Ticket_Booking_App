import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketCreatedListener } from '../ticket_created_listener';
import { natsWrapper } from '../../../nats_wrapper';
import { TicketCreatedEvent } from '@richardcap/common';
import { Message } from 'node-nats-streaming';

const setup = async () => {
    // Create listener
    const listener = new TicketCreatedListener(natsWrapper.client);
    // Create a ticket event
    const data: TicketCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString()
    };
    // Create a message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return {
        listener,
        data,
        msg
    };
}

it('creates and saves a ticket', async () => {
    const { listener, data, msg } = await setup();
    // Call the onMessage function
    await listener.onMessage(data, msg);
    // Check the ticket was created
    const ticket = await Ticket.findById(data.id);
    expect(ticket!).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
});

it('ack the message', async () => {
    const { listener, data, msg } = await setup();
    // Call the onMessage function
    await listener.onMessage(data, msg);
    // Check the ack() function was called
    expect(msg.ack).toHaveBeenCalled();
});