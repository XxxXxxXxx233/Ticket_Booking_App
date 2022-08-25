import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { natsWrapper } from '../../nats_wrapper';

it('returns a 404 if the id does not exist', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin();
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'asdna',
            price: 20
        })
        .expect(404);
});

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'asdna',
            price: 20
        })
        .expect(401);
});

it('returns a 401 if the user does not own the ticket', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1',
            price: 20
        })
        .expect(201);
    
    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', global.signin())
        .send({
            title: 'new ticket',
            price: 40
        })
        .expect(401);
});

it('returns a 400 if the user provides an invalid title or price', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const cookie = global.signin();
    await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send({
            title: 'ticket1',
            price: 20
        })
        .expect(201);
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        })
        .expect(400);
    await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'asbab',
            price: -10
        })
        .expect(400);
});

it('updates the ticket with valid inputs', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ticket1',
            price: 20
        })
        .expect(201);
    expect(response.body.title).toEqual('ticket1');
    expect(response.body.price).toEqual(20);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new ticket',
            price: 200
        })
        .expect(200);

    const updateResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200);
    expect(updateResponse.body.title).toEqual('new ticket');
    expect(updateResponse.body.price).toEqual(200);
});

it('publishes an event', async () => {
    const cookie = global.signin();
    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'ticket1',
            price: 20
        })
        .expect(201);

    await request(app)
        .put(`/api/tickets/${response.body.id}`)
        .set('Cookie', cookie)
        .send({
            title: 'new ticket',
            price: 200
        })
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
});