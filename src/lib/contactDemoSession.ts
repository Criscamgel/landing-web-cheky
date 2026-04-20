const SESSION_KEY = 'cheky_landing_contact_demo_sent'

export function hasContactDemoBeenSentInSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function markContactDemoSentInSession(): void {
  try {
    sessionStorage.setItem(SESSION_KEY, '1')
  } catch {
    /* storage lleno o modo privado */
  }
}
