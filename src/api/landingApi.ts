import axios from 'axios'

/**
 * Cliente público hacia la API Nest (sin token).
 * `VITE_API_URL` debe incluir el prefijo `/api`, p. ej. `https://api.tudominio.com/api`
 */
export const landingApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '',
  headers: {
    'Content-Type': 'application/json',
  },
})
