FROM node:22 AS build

WORKDIR /ephemera

COPY . .

RUN corepack enable

RUN pnpm install --frozen-lockfile
RUN pnpm build 

RUN pnpm deploy --filter=@ephemera/server --prod ./out

FROM node:22 AS prod

WORKDIR /ephemera

ENV NODE_ENV=production

COPY --from=build /ephemera/out ./

EXPOSE 3000
CMD ["node", "./dist/src/server.js"]



