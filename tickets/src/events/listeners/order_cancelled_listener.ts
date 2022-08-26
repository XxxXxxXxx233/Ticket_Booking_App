import { Message } from "node-nats-streaming";
import { Listener, OrderCancelledEvent, Subjects } from "@richardcap/common";
import { queueGroupName } from "./queue_group_name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket_updated_publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
        const ticket = await Ticket.findById(data.ticket.id);
        if (!ticket) {
            throw new Error('Ticket not found');
        }

        ticket.set({
            orderId: undefined
        });
        await ticket.save();

        await new TicketUpdatedPublisher(this.client).publish({
            id: ticket.id,
            price: ticket.price,
            title: ticket.title,
            orderId: ticket.orderId,
            userId: ticket.userId,
            version: ticket.version
        });

        msg.ack();
    }
}