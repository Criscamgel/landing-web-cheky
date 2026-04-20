import { LandingPage } from '@/components/landing/LandingPage'
import { useLandingPage } from '@/hooks/useLandingPage'

export default function App() {
  const { data, isLoading, error } = useLandingPage()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-[#666]">
        Cargando…
      </div>
    )
  }

  if (error) {
    console.warn(error)
  }

  return <LandingPage data={data} />
}
