import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { LandingPostPaymentSignupModal } from '@/components/landing/LandingPostPaymentSignupModal'
import { LandingBoldCheckoutBlockingOverlay } from '@/components/landing/LandingBoldCheckoutBlockingOverlay'
import { LandingPage } from '@/components/landing/LandingPage'
import { useLandingPage } from '@/hooks/useLandingPage'
import { postBoldConfirm } from '@/actions/postBoldConfirm.action'
import {
  BOLD_CONFIRM_LOCK_KEY,
  BOLD_PAYMENT_LINK_SESSION_KEY,
  clearLandingBoldCheckoutPending,
  isLandingBoldCheckoutPending,
} from '@/lib/boldCheckoutSession'

export default function App() {
  const { data, isLoading, error } = useLandingPage()
  const [landingSignupOpen, setLandingSignupOpen] = useState(false)
  const [onboardingPaymentLink, setOnboardingPaymentLink] = useState<string | null>(null)
  const [boldFlowBlocking, setBoldFlowBlocking] = useState(false)

  useEffect(() => {
    const sp = new URLSearchParams(window.location.search)
    const isPayReturn = sp.get('pagoBold') === '1'

    const onPageShow = () => {
      if (isLandingBoldCheckoutPending() && window.location.search.indexOf('pagoBold') === -1) {
        clearLandingBoldCheckoutPending()
        setBoldFlowBlocking(false)
      }
    }
    window.addEventListener('pageshow', onPageShow)
    window.addEventListener('popstate', onPageShow)

    if (!isPayReturn) {
      return () => {
        window.removeEventListener('pageshow', onPageShow)
        window.removeEventListener('popstate', onPageShow)
      }
    }

    if (sessionStorage.getItem(BOLD_CONFIRM_LOCK_KEY) === '1') {
      return () => {
        window.removeEventListener('pageshow', onPageShow)
        window.removeEventListener('popstate', onPageShow)
      }
    }

    const paymentLink = sessionStorage.getItem(BOLD_PAYMENT_LINK_SESSION_KEY)?.trim()
    if (!paymentLink) {
      window.history.replaceState({}, '', `${window.location.pathname}${window.location.hash}`)
      clearLandingBoldCheckoutPending()
      return () => {
        window.removeEventListener('pageshow', onPageShow)
        window.removeEventListener('popstate', onPageShow)
      }
    }

    setOnboardingPaymentLink(paymentLink)
    sessionStorage.removeItem(BOLD_PAYMENT_LINK_SESSION_KEY)
    sessionStorage.setItem(BOLD_CONFIRM_LOCK_KEY, '1')
    setBoldFlowBlocking(true)

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
        setOnboardingPaymentLink(null)
      } finally {
        sessionStorage.removeItem(BOLD_CONFIRM_LOCK_KEY)
        clearLandingBoldCheckoutPending()
        setBoldFlowBlocking(false)
      }
    })()

    return () => {
      window.removeEventListener('pageshow', onPageShow)
      window.removeEventListener('popstate', onPageShow)
    }
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
      <LandingBoldCheckoutBlockingOverlay open={boldFlowBlocking} />
      <LandingPostPaymentSignupModal
        open={landingSignupOpen}
        onOpenChange={(open) => {
          setLandingSignupOpen(open)
          if (!open) setOnboardingPaymentLink(null)
        }}
        paymentLink={onboardingPaymentLink}
      />
      <LandingPage data={data} />
    </>
  )
}
