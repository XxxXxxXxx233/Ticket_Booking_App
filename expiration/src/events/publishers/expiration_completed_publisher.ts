import { Subjects, ExpirationCompletedEvent, Publisher } from "@richardcap/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
    subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}