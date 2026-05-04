import axios from 'axios'
import { landingApi } from '@/api/landingApi'
import { getPublicApiBaseUrl } from '@/lib/runtimeEnv'

export type BoldCheckoutStartEnvelope = {
  success?: boolean
  message?: string
  data?: {
    redirectUrl?: string
    paymentLink?: string
    reference?: string
  }
}

export async function postBoldCheckout(planId: string): Promise<BoldCheckoutStartEnvelope> {
  const base = getPublicApiBaseUrl()
  if (!base) {
    throw new Error('Falta VITE_API_URL (URL de la API con /api).')
  }
  try {
    const { data } = await landingApi.post<BoldCheckoutStartEnvelope>(
      '/public/bold/checkout',
      { planId },
    )
    if (!data?.success || !data.data?.redirectUrl || !data.data?.paymentLink) {
      throw new Error(data?.message || 'No se pudo iniciar el pago')
    }
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as { message?: string | string[] }
      const raw = body?.message
      const msg = Array.isArray(raw) ? raw.join('. ') : raw
      throw new Error(msg || error.message || 'No se pudo iniciar el pago')
    }
    throw error
  }
}
