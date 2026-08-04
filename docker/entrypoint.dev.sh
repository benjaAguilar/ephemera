#!/bin/bash

cd apps/server/

pnpm dlx prisma migrate deploy

cd ../../

exec pnpm dev --host
