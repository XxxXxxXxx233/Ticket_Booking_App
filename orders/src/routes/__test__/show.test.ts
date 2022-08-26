import request from 'supertest';
import { app } from '../../app';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';

it('fetches the order', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const cookie = global.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    const { body: order } = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie', cookie)
        .send({})
        .expect(200);
    expect(order.id).toEqual(response.body.id);
    expect(order.ticket.id).toEqual(ticket.id);
});

it('returns an error if user 1 tries to fetch user 2 orders', async () => {
    const ticket = Ticket.build({
        title: 'concert',
        price: 20
    });
    await ticket.save();

    const cookie = global.signin();
    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })
        .expect(201);
    
    await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({})
        .expect(401);
});