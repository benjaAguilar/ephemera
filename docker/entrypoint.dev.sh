#!/bin/bash

cd apps/server/

pnpm exec prisma migrate deploy

cd ../../

pnpm build:packages
exec pnpm dev --host
