/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRAPI_URL?: string
  readonly VITE_STRAPI_API_TOKEN?: string
  /** Base URL del backend Nest (incluye `/api`), misma convención que cheky-web-app */
  readonly VITE_API_URL?: string
  /** Solo origen SPA (ej. https://app.cheky.co); post-pago landing → crear cuenta */
  readonly VITE_WEB_APP_URL?: string
  /** URL absoluta o relativa al PDF de condiciones del servicio (modal “Adquirir”) */
  readonly VITE_TERMS_PDF_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
