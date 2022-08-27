import { Listener, OrderCreatedEvent, Subjects } from "@richardcap/common";
import { queueGroupName } from "./queue_group_name";
import { Message } from "node-nats-streaming";
import { expirationQueue } from "../../queues/expiration_queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message) {
        const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
        console.log('Expiration Delay:', delay);
        
        await expirationQueue.add(
            {
                orderId: data.id
            },
            {
                delay
            }
        );
        msg.ack();
    }
}