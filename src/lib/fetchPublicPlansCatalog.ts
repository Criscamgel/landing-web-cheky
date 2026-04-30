import { landingApi } from '@/api/landingApi'
import type { PublicPlanDto } from '@/types/publicPlan'

type ApiEnvelope = {
  success?: boolean
  data?: PublicPlanDto[]
}

const CATALOG_LIMIT = 100

export async function fetchPublicPlansCatalog(): Promise<PublicPlanDto[]> {
  const { data } = await landingApi.get<ApiEnvelope>('/plans/public/catalog', {
    params: { page: 1, limit: CATALOG_LIMIT },
  })
  if (!data?.success || !Array.isArray(data.data)) {
    throw new Error('Respuesta inválida del catálogo de planes')
  }
  return data.data
}
