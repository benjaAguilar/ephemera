import express from 'express';
import type { User as PrismaUser } from '../../prisma/generated/prisma/client.js';

export type Request = express.Request;
export type Response = express.Response;
export type Next = express.NextFunction;
export type Error = express.ErrorRequestHandler;

declare global {
  /* eslint-disable @typescript-eslint/no-namespace */
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    interface User extends PrismaUser {}
  }
}
