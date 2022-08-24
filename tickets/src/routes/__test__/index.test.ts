import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const createTicket = async () => {
    const cookie = global.signin();
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ticket1',
            price: 10
        })
        .expect(201);
}

it('fetch a list of tickets', async () => {
    await createTicket();
    await createTicket();
    await createTicket();
    const response = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);
    expect(response.body.length).toEqual(3);
})