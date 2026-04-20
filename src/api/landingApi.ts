import axios from 'axios'
import { getPublicApiBaseUrl } from '@/lib/runtimeEnv'

/**
 * Cliente público hacia la API Nest (sin token).
 * La base URL se resuelve en cada petición (build Vite o runtime `env.js`).
 */
export const landingApi = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
})

landingApi.interceptors.request.use((config) => {
  config.baseURL = getPublicApiBaseUrl()
  return config
})
