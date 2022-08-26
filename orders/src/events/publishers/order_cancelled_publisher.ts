import { Publisher, OrderCancelledEvent, Subjects } from "@richardcap/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}