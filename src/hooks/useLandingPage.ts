import { useEffect, useState } from 'react'
import { defaultLandingPage } from '@/data/defaultLanding'
import { fetchLandingFromStrapi, getStrapiUrl } from '@/lib/strapi'
import type { LandingPageData } from '@/types/landing'

type Status = 'idle' | 'loading' | 'ready' | 'error'

export function useLandingPage(apiPath?: string) {
  const [data, setData] = useState<LandingPageData>(defaultLandingPage)
  const [status, setStatus] = useState<Status>(() =>
    getStrapiUrl() ? 'loading' : 'ready',
  )
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    if (!getStrapiUrl()) {
      setData(defaultLandingPage)
      setStatus('ready')
      setError(null)
      return
    }

    setStatus('loading')
    setError(null)

    fetchLandingFromStrapi(apiPath)
      .then((next) => {
        if (!cancelled) {
          setData(next)
          setStatus('ready')
        }
      })
      .catch((e: unknown) => {
        if (!cancelled) {
          setData(defaultLandingPage)
          setError(e instanceof Error ? e : new Error(String(e)))
          setStatus('error')
        }
      })

    return () => {
      cancelled = true
    }
  }, [apiPath])

  return { data, status, error, isLoading: status === 'loading' }
}
