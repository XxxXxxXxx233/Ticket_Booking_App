import mongoose from 'mongoose';
import { TicketUpdatedEvent } from '@richardcap/common';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedListener } from '../ticket_updated_listener';
import { natsWrapper } from '../../../nats_wrapper';

const setup = async () => {
    // Create listener
    const listener = new TicketUpdatedListener(natsWrapper.client);
    // Create a ticket
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();
    // Create a ticket event
    const data: TicketUpdatedEvent['data'] = {
        id: ticket.id,
        version: ticket.version + 1,
        title: 'concert new',
        price: 200.123,
        userId: new mongoose.Types.ObjectId().toHexString()
    };
    // Create a message object
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };
    return {
        ticket,
        listener,
        data,
        msg
    };
}

it('finds, updates, and saves a ticket', async () => {
    const { ticket, listener, data, msg } = await setup();
    // Call the onMessage function
    await listener.onMessage(data, msg);
    // Check the ticket was created
    const ticket1 = await Ticket.findById(data.id);
    expect(ticket1!).toBeDefined();
    expect(ticket1!.title).toEqual(data.title);
    expect(ticket1!.version).toEqual(data.version);
});

it('ack the message', async () => {
    const { ticket, listener, data, msg } = await setup();
    // Call the onMessage function
    await listener.onMessage(data, msg);
    // Check the ack() function was called
    expect(msg.ack).toHaveBeenCalled();
});

it('dose not call ack if the event has a skipped version number', async () => {
    const { ticket, listener, data, msg } = await setup();
    data.version += 10;
    try {
        await listener.onMessage(data, msg);
    } catch (err) {

    }
    expect(msg.ack).not.toHaveBeenCalled();
})