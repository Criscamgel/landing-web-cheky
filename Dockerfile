# Build estático (Vite). Las VITE_* aquí se incrustan en el bundle; también puedes solo definirlas al **runtime** (env.js).
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Opcional en CI: Build Args si construyes sin runtime env (Dokploy “Build Arguments”)
ARG VITE_API_URL
ARG VITE_STRAPI_URL
ARG VITE_STRAPI_API_TOKEN
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL
ENV VITE_STRAPI_API_TOKEN=$VITE_STRAPI_API_TOKEN

RUN npm run build

FROM nginx:alpine
RUN apk add --no-cache jq

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
ENTRYPOINT ["/docker-entrypoint.sh"]
