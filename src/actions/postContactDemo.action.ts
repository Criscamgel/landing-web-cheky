import axios from 'axios'
import { landingApi } from '@/api/landingApi'

export interface ContactDemoPayload {
  name: string
  email: string
  company: string
  volume: string
}

export interface ContactDemoApiEnvelope {
  success: boolean
  message: string
  data?: { sent: boolean }
  timestamp?: string
}

export async function postContactDemo(
  payload: ContactDemoPayload,
): Promise<ContactDemoApiEnvelope> {
  const base = import.meta.env.VITE_API_URL
  if (!base || String(base).trim() === '') {
    throw new Error(
      'Falta configurar VITE_API_URL (URL base de la API, incluyendo /api).',
    )
  }
  try {
    const { data } = await landingApi.post<ContactDemoApiEnvelope>(
      '/public/contact-demo',
      payload,
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as {
        message?: string | string[]
      }
      const raw = body?.message
      const msg = Array.isArray(raw)
        ? raw.join('. ')
        : raw
      throw new Error(msg || error.message || 'No se pudo enviar la solicitud')
    }
    throw error
  }
}
