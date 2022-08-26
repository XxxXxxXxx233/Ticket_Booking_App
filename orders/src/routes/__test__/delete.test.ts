import request from 'supertest';
import { app } from '../../app';
import { Order, OrderStatus } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats_wrapper';

it('marks an order as cancalled', async () => {
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
        .delete(`/api/orders/${response.body.id}`)
        .set('Cookie', cookie)
        .send({})
        .expect(204)
    
    const { body: order } = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie', cookie)
        .send({})
        .expect(200)
    expect(order.status).toEqual(OrderStatus.Cancelled);
});

it('emits an order delete event', async () => {
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
        .delete(`/api/orders/${response.body.id}`)
        .set('Cookie', cookie)
        .send({})
        .expect(204)
    
    const { body: order } = await request(app)
        .get(`/api/orders/${response.body.id}`)
        .set('Cookie', cookie)
        .send({})
        .expect(200)
    expect(order.status).toEqual(OrderStatus.Cancelled);
    
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});