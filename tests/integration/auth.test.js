import request from 'supertest';
import app from '../../app.js';

describe('Auth API', () => {
  it('should register a user', async () => {
    const res = await request(app).post('/api/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.statusCode).toBe(201);
  });
});
