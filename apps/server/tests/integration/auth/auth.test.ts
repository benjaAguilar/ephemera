import { describe, expect, it } from 'vitest';
import request from 'supertest';
import { app, prisma } from '../setup.js';

describe('Auth Integration', () => {
  describe('POST /api/auth', () => {
    it('should response 200 and create the user at the DB', async () => {
      const res = await request(app).post('/api/auth').send({
        username: 'pickle',
        ttl: '30m',
      });

      const user = await prisma.user.findUnique({
        where: {
          username: 'pickle',
        },
      });

      expect(res.status).toBe(200);
      expect(res.headers['set-cookie']).toBeDefined();

      expect(user).not.toBeNull();
      expect(user).toMatchObject({
        username: 'pickle',
      });
    });

    it('should throw a 409 if user already exists', async () => {
      await prisma.user.create({
        data: {
          username: 'lilo',
        },
      });

      const res = await request(app).post('/api/auth').send({
        username: 'lilo',
        ttl: '15m',
      });

      expect(res.status).toBe(409);
      expect(res.body).toMatchObject({
        message: 'Username already taken',
      });
    });

    it('should throw a 400 if no body is given', async () => {
      const res = await request(app).post('/api/auth');

      expect(res.status).toBe(400);
      expect(res.body).toMatchObject({
        message: 'Bad request',
      });
    });
  });

  describe('POST /api/auth/kill', () => {
    it('should response 200 deleting the user at db level', async () => {
      const createUserRes = await request(app).post('/api/auth').send({
        username: 'test-user',
        ttl: '1h',
      });

      const cookie = createUserRes.headers['set-cookie'];

      const res = await request(app)
        .post('/api/auth/kill')
        .set('Cookie', cookie ? cookie : '');

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({
        message: 'User test-user has expired',
      });

      const user = await prisma.user.findUnique({
        where: {
          username: 'test-user',
        },
      });

      expect(user).toBeNull();
    });

    it('should return 401 when no auth cookie is provided', async () => {
      const res = await request(app).post('/api/auth/kill');

      expect(res.status).toBe(401);
    });

    it('should return 401 when invalid cookie is provided', async () => {
      const res = await request(app)
        .post('/api/auth/kill')
        .set('Cookie', 'authToken=invalidcookie');

      expect(res.status).toBe(401);
    });
  });
});
