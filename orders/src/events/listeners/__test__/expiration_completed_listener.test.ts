import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { OrderStatus, ExpirationCompletedEvent } from "@richardcap/common";
import { ExpirationCompletedListener } from "../expiration_completed_listener";
import { natsWrapper } from "../../../nats_wrapper";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
    const listener = new ExpirationCompletedListener(natsWrapper.client);
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const order = Order.build({
        status: OrderStatus.Created,
        userId: 'asabad',
        expiresAt: new Date(),
        ticket
    });
    await order.save();

    const data: ExpirationCompletedEvent['data'] = {
        orderId: order.id
    };
    // @ts-ignore
    const msg: Message = {
        ack: jest.fn()
    };

    return {
        listener,
        order,
        ticket,
        data,
        msg
    }
}

it('updates the order stauts to cancelled', async () => {
    const { listener, order, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);

    const updatedOrder = await Order.findById(order.id);
    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emit an OrderCancelled event', async () => {
    const { listener, order, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
    const event = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])
    expect(event.id).toEqual(order.id);
});

it('acks the message', async () => {
    const { listener, order, ticket, data, msg } = await setup();
    await listener.onMessage(data, msg);
    expect(msg.ack).toHaveBeenCalled();
});