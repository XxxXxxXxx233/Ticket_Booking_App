import { Publisher, Subjects, TicketUpdatedEvent } from "@richardcap/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}