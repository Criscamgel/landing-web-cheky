import { getEnv } from '@/lib/runtimeEnv'

export function getTurnstileSiteKey(): string {
  return getEnv('VITE_TURNSTILE_SITE_KEY')
}

export function isTurnstileConfigured(): boolean {
  return getTurnstileSiteKey().length > 0
}
