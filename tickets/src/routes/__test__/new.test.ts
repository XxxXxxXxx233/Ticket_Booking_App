import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats_wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});
    expect(response.status).not.toEqual(404);
});

it('can only be accessed if has signed in', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({})
        .expect(401);
});

it('return a status other than 401 if has signed in', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({});
    expect(response.status).not.toEqual(401);
});

it('return an error if title in invalid', async () => {
    const cookie = global.signin();
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            price: 10
        })
        .expect(400);
});

it('return an error if price in invalid', async () => {
    const cookie = global.signin();
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'agadgad',
            price: -10
        })
        .expect(400);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'agadgad'
        })
        .expect(400);
});

it('create a ticket with valid inputs', async () => {
    // add in a check to make sure a ticket was saved
    const cookie = global.signin();
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ticket1',
            price: 20
        })
        .expect(201);
    
    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(20);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ticket1',
            price: 20
        })
        .expect(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});