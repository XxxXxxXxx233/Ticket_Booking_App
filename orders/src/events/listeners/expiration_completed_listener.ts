import { Listener, Subjects, ExpirationCompletedEvent, OrderStatus } from "@richardcap/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue_group_name";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order_cancelled_publisher";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
    queueGroupName = queueGroupName;

    async onMessage(data: ExpirationCompletedEvent['data'], msg: Message) {
        const order = await Order.findById(data.orderId).populate('ticket');
        if (!order) {
            throw new Error('Order not found');
        }

        order.set({
            status: OrderStatus.Cancelled
        });
        await order.save();

        await new OrderCancelledPublisher(this.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        });
        msg.ack();
    }
}