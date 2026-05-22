#!/bin/sh
set -e
# Runtime (Dokploy / Docker): variables disponibles al arrancar el contenedor → env.js para el navegador
OUT=/usr/share/nginx/html/env.js
# jq genera JSON seguro (escapa comillas, etc.)
printf 'window.__CHEKY_ENV__=%s;\n' "$(jq -n \
  --arg a "${VITE_API_URL:-}" \
  --arg s "${VITE_STRAPI_URL:-}" \
  --arg t "${VITE_STRAPI_API_TOKEN:-}" \
  --arg ts "${VITE_TURNSTILE_SITE_KEY:-}" \
  '{VITE_API_URL:$a,VITE_STRAPI_URL:$s,VITE_STRAPI_API_TOKEN:$t,VITE_TURNSTILE_SITE_KEY:$ts}')" >"$OUT"
exec nginx -g "daemon off;"
