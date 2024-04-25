FROM docker.io/library/node:21.4.0-bookworm
COPY . /app
WORKDIR /app
RUN corepack enable pnpm && pnpm install && npx vue-tsc
