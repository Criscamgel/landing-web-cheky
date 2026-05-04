import axios from 'axios'
import { landingApi } from '@/api/landingApi'
import { getPublicApiBaseUrl } from '@/lib/runtimeEnv'

export type BoldConfirmEnvelope = {
  success?: boolean
  message?: string
  data?: { fulfilled?: boolean; source?: string }
}

export async function postBoldConfirm(paymentLink: string): Promise<BoldConfirmEnvelope> {
  const base = getPublicApiBaseUrl()
  if (!base) {
    throw new Error('Falta VITE_API_URL (URL de la API con /api).')
  }
  try {
    const { data } = await landingApi.post<BoldConfirmEnvelope>('/public/bold/confirm', {
      paymentLink,
    })
    if (!data?.success) {
      throw new Error(data?.message || 'No se pudo confirmar el pago')
    }
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as { message?: string | string[] }
      const raw = body?.message
      const msg = Array.isArray(raw) ? raw.join('. ') : raw
      throw new Error(msg || error.message || 'No se pudo confirmar el pago')
    }
    throw error
  }
}
