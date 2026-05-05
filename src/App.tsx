import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LandingPostPaymentSignupModal } from '@/components/landing/LandingPostPaymentSignupModal'
import { LandingPage } from '@/components/landing/LandingPage'
import { useLandingPage } from '@/hooks/useLandingPage'
import { postBoldConfirm } from '@/actions/postBoldConfirm.action'
import {
  BOLD_CONFIRM_LOCK_KEY,
  BOLD_PAYMENT_LINK_SESSION_KEY,
} from '@/lib/boldCheckoutSession'

export default function App() {
  const { data, isLoading, error } = useLandingPage()
  const [landingSignupOpen, setLandingSignupOpen] = useState(false)

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    if (sp.get('pagoBold') !== '1') return
    if (sessionStorage.getItem(BOLD_CONFIRM_LOCK_KEY) === '1') return

    const paymentLink = sessionStorage.getItem(BOLD_PAYMENT_LINK_SESSION_KEY)?.trim()
    if (!paymentLink) {
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`)
      return
    }

    sessionStorage.setItem(BOLD_CONFIRM_LOCK_KEY, '1')
    sessionStorage.removeItem(BOLD_PAYMENT_LINK_SESSION_KEY)
    void (async () => {
      try {
        const res = await postBoldConfirm(paymentLink)
        window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`)
        toast.success(res.message ?? 'Gracias por tu pago.')
        if (res.data?.source === 'landing' && res.data?.fulfilled !== false) {
          setLandingSignupOpen(true)
        }
      } catch (e) {
        sessionStorage.setItem(BOLD_PAYMENT_LINK_SESSION_KEY, paymentLink)
        window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`)
        toast.error(e instanceof Error ? e.message : 'No se pudo confirmar el pago')
      } finally {
        sessionStorage.removeItem(BOLD_CONFIRM_LOCK_KEY)
      }
    })()
  }, [])

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

  return (
    <>
      <LandingPostPaymentSignupModal open={landingSignupOpen} onOpenChange={setLandingSignupOpen} />
      <LandingPage data={data} />
    </>
  )
}
