FROM docker.io/library/node:20.11.0-bookworm
COPY . /app
WORKDIR /app
RUN corepack enable pnpm && pnpm install && npx vue-tsc
