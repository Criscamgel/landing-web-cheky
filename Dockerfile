# Build estático (Vite). Variables VITE_* deben existir en tiempo de build.
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Dokploy: pasa estas variables como "Build Arguments" o en el paso de build
ARG VITE_STRAPI_URL
ARG VITE_STRAPI_API_TOKEN
ENV VITE_STRAPI_URL=$VITE_STRAPI_URL
ENV VITE_STRAPI_API_TOKEN=$VITE_STRAPI_API_TOKEN

RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
