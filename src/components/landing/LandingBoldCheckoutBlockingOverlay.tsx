type Props = {
  open: boolean
}

/** Bloquea la UI mientras se espera redirección a Bold o confirmación de pago. */
export function LandingBoldCheckoutBlockingOverlay({ open }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center gap-4 bg-black/60 px-6 text-center text-white"
      role="alertdialog"
      aria-busy="true"
      aria-live="polite"
      aria-label="Procesando pago"
    >
      <div className="size-10 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      <p className="max-w-sm text-sm font-medium leading-relaxed">
        Procesando pago con Bold… No cierres esta ventana.
      </p>
    </div>
  )
}
