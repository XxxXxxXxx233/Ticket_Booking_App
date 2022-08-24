import mongoose from "mongoose";

// Properties that are required to build a new ticket
interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
};

// Properties that a ticket has
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
};

// Properties tied to the model
interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc;
};

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    },

}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
    return new Ticket(attrs);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };