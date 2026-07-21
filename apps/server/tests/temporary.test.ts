import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/app.js';

describe('First test suite', () => {
  it('should return string: Hello World', async () => {
    const res = await request(app).get('/api');

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual('Hello World');
  });
});
