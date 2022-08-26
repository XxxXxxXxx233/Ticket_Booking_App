import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCreatedListener } from "../order_created_listener"
import { OrderCreatedEvent, OrderStatus } from "@richardcap/common";
import { natsWrapper } from "../../../nats_wrapper"
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    // Create the listener
    const listener = new OrderCreatedListener(natsWrapper.client);
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 99,
        userId: new mongoose.Types.ObjectId().toHexString()
    });
    await ticket.save();
    // Create the event
    const data: OrderCreatedEvent['data'] = {
        id: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        status: OrderStatus.Created,
        userId: new mongoose.Types.ObjectId().toHexString(),
        expiresAt: 'asdasf',
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    };
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {
        listener,
        ticket,
        data,
        msg
    }
}

it('sets the userId of the ticket', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acks the message', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(msg.ack).toHaveBeenCalled();
})

it('publish a ticket updated event', async () => {
    const { listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const updatedTicket = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(updatedTicket.orderId).toEqual(data.id);
})