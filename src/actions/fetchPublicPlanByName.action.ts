import axios from 'axios'
import { landingApi } from '@/api/landingApi'
import type { PublicPlanDto } from '@/types/publicPlan'

type ApiEnvelope = {
  success?: boolean
  data?: PublicPlanDto
}

export async function fetchPublicPlanByName(name: string): Promise<PublicPlanDto> {
  const trimmed = name.trim()
  if (!trimmed) {
    throw new Error('Ingresa el nombre del plan')
  }

  try {
    const { data } = await landingApi.get<ApiEnvelope>('/plans/public/by-name', {
      params: { name: trimmed },
    })
    if (!data?.success || !data.data?.id) {
      throw new Error('Respuesta inválida del servidor')
    }
    return data.data
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error('NOT_FOUND')
    }
    throw error
  }
}
