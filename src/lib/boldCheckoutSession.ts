/** Id del payment link de Bold guardado antes de redirigir al checkout. */
export const BOLD_PAYMENT_LINK_SESSION_KEY = 'cheky_bold_payment_link'

/** Evita doble confirmación (p. ej. React StrictMode). */
export const BOLD_CONFIRM_LOCK_KEY = 'cheky_bold_confirm_lock'

/** Checkout iniciado desde la landing; se limpia al volver sin pago o tras confirmación. */
export const LANDING_BOLD_CHECKOUT_PENDING_KEY = 'cheky_landing_bold_checkout_pending'

export const LANDING_BOLD_CHECKOUT_PLAN_ID_KEY = 'cheky_landing_bold_checkout_plan_id'

export function setLandingBoldCheckoutPending(planId: string) {
  try {
    sessionStorage.setItem(LANDING_BOLD_CHECKOUT_PENDING_KEY, '1')
    sessionStorage.setItem(LANDING_BOLD_CHECKOUT_PLAN_ID_KEY, planId)
  } catch {
    /* ignore */
  }
}

export function clearLandingBoldCheckoutPending() {
  try {
    sessionStorage.removeItem(LANDING_BOLD_CHECKOUT_PENDING_KEY)
    sessionStorage.removeItem(LANDING_BOLD_CHECKOUT_PLAN_ID_KEY)
  } catch {
    /* ignore */
  }
}

export function isLandingBoldCheckoutPending(): boolean {
  try {
    return sessionStorage.getItem(LANDING_BOLD_CHECKOUT_PENDING_KEY) === '1'
  } catch {
    return false
  }
}
