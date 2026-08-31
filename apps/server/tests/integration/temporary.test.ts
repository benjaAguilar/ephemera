import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app } from './setup.js';

describe('get /api', () => {
  it('should return 200 and hello world', async () => {
    const res = await request(app).get('/api');

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'Hello World' });
  });
});
