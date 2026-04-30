import { useQuery } from '@tanstack/react-query'
import { fetchPublicPlansCatalog } from '@/lib/fetchPublicPlansCatalog'

export const publicPlansCatalogQueryKey = ['public-plans-catalog'] as const

export function usePublicPlansCatalogQuery() {
  return useQuery({
    queryKey: publicPlansCatalogQueryKey,
    queryFn: fetchPublicPlansCatalog,
    staleTime: 5 * 60 * 1000,
  })
}
