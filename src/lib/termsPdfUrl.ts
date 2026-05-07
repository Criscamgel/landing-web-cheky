/** URL del PDF de condiciones; env absoluta/relativa o fallback a `/condiciones-servicio.pdf` en public. */
export function getTermsPdfUrl(): string {
  const raw = import.meta.env.VITE_TERMS_PDF_URL?.trim() ?? ''
  if (raw) return raw
  return '/condiciones-servicio.pdf'
}
