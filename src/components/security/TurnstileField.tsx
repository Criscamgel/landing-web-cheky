import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'
import { getTurnstileSiteKey, isTurnstileConfigured } from '@/lib/turnstile.config'

type Props = {
  onToken: (token: string) => void
  className?: string
}

/** Widget Cloudflare Turnstile (site key en `VITE_TURNSTILE_SITE_KEY`). */
export function TurnstileField({ onToken, className }: Props) {
  const ref = useRef<TurnstileInstance>(null)
  const siteKey = getTurnstileSiteKey()

  if (!isTurnstileConfigured()) {
    return null
  }

  return (
    <div className={className}>
      <Turnstile
        ref={ref}
        siteKey={siteKey}
        options={{ theme: 'light', size: 'normal' }}
        onSuccess={(token) => onToken(token)}
        onExpire={() => {
          onToken('')
          ref.current?.reset()
        }}
        onError={() => {
          onToken('')
          ref.current?.reset()
        }}
      />
    </div>
  )
}
