import { Message } from 'node-nats-streaming';
import { Listener, TicketCreatedEvent, Subjects } from '@richardcap/common';

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
    queueGroupName = 'payments_service';

    onMessage(data: TicketCreatedEvent['data'], msg: Message) {
        console.log('Event data!', data);
        console.log(data.id);
        console.log(data.title);
        console.log(data.price);
        msg.ack();
    }
}