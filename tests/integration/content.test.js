import request from 'supertest';
import app from '../../app.js';

describe('Content API', () => {
  it('should generate a title', async () => {
    const res = await request(app).post('/api/content/generate-title').send({
      appName: 'TestApp',
    });
    expect(res.statusCode).toBe(200);
  });
});
