import { Publisher, OrderCreatedEvent, Subjects } from "@richardcap/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}