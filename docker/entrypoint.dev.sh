#!/bin/bash

cd apps/server/

pnpm dlx prisma migrate deploy

cd ../../

pnpm build:packages
exec pnpm dev --host
