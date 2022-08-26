import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderCancelledListener } from "../order_cancelled_listener";
import { OrderCancelledEvent, OrderStatus } from "@richardcap/common";
import { Ticket } from "../../../models/ticket";
import { natsWrapper } from "../../../nats_wrapper"

const setup = async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();
    // Create the listener
    const listener = new OrderCancelledListener(natsWrapper.client);
    // Create a ticket
    const ticket = Ticket.build({
        title: 'concert',
        price: 20,
        userId: new mongoose.Types.ObjectId().toHexString(),
    });
    ticket.set({ orderId })
    await ticket.save();
    // Create the event
    const data: OrderCancelledEvent['data'] = {
        id: orderId,
        version: 0,
        ticket: {
            id: ticket.id
        }
    };
    
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    }

    return {
        orderId,
        listener,
        ticket,
        data,
        msg
    }
}

it('updates the ticket, publishes an event, and acks the msg', async () => {
    const { orderId, listener, ticket, data, msg } = await setup();

    await listener.onMessage(data, msg);

    const updatedTicket = await Ticket.findById(ticket.id);
    expect(updatedTicket!.orderId).not.toBeDefined();
    expect(msg.ack).toHaveBeenCalled();
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});