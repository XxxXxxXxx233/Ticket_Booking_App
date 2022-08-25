import { Message } from 'node-nats-streaming';
import { Listener } from './base_listener';
import { TicketCreatedEvent } from './ticket_created_event';
import { Subjects } from './subjects';

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