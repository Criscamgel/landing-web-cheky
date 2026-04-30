/** Plan público (`GET /plans/public/catalog`, mismo shape que `toPublicPlan` en Nest). */
export type PublicPlanDto = {
  id: string
  name: string
  maxUsers: number
  maxChecks: number
  durationMonths: number
  monthlyPrice: number
  currency?: string
  isVisible?: boolean
  isActive?: boolean
}
