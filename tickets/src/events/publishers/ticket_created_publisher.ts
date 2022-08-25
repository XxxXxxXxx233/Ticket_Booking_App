import { Publisher, Subjects, TicketCreatedEvent } from "@richardcap/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}