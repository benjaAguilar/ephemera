FROM node:22 AS build

WORKDIR /ephemera

COPY . .

RUN corepack enable

RUN pnpm install --frozen-lockfile
RUN pnpm build 

FROM node:22 AS prod

WORKDIR /ephemera

RUN corepack enable

ENV NODE_ENV=production

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/server/package.json ./apps/server/
COPY apps/client/package.json ./apps/client/

RUN pnpm install --prod --frozen-lockfile --config.confirmModulesPurge=false

COPY --from=build /ephemera/apps/server/dist/ ./apps/server/dist/

EXPOSE 3000
CMD ["node", "./apps/server/dist/src/server.js"]



