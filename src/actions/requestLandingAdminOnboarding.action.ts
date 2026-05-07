import axios from 'axios'
import { landingApi } from '@/api/landingApi'

export type RequestLandingAdminOnboardingResponse = {
  success?: boolean
  message?: string
}

export async function requestLandingAdminOnboarding(params: {
  paymentLink: string
  email: string
}): Promise<RequestLandingAdminOnboardingResponse> {
  try {
    const { data } = await landingApi.post<RequestLandingAdminOnboardingResponse>(
      '/public/landing/request-admin-onboarding',
      {
        paymentLink: params.paymentLink.trim(),
        email: params.email.trim(),
      },
    )
    return data ?? {}
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as { message?: string | string[] }
      const raw = body?.message
      const msg = Array.isArray(raw) ? raw.join('. ') : raw
      throw new Error(msg || error.message || 'No se pudo enviar el correo')
    }
    throw error
  }
}
