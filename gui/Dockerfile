# Build the Vue app
FROM node:20 as build-stage

ARG BUILD_ID
ARG BUILD_CONTEXT

WORKDIR /app
COPY package*.json ./
COPY .env.docker ./.env


ENV VITE_BUILD_ID=${BUILD_ID}
ENV VITE_CONTEXT=${BUILD_CONTEXT}

RUN npm install --include-dev
COPY ./ .
RUN npm run build

# Copy the compiled app in an NGINX contaier
FROM nginx:alpine as production-stage
RUN mkdir /app
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Executing the script at container runtime
COPY set_env.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/set_env.sh

