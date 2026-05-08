import { useEffect, useState } from 'react'
import type { PublicPlanDto } from '@/types/publicPlan'
import { SERVICE_TERMS_AND_RESTRICTIONS } from '@/lib/serviceTerms'

type Props = {
  plan: PublicPlanDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmContinue: () => void
}

/**
 * Confirmación antes de ir a Bold: texto de condiciones en panel con scroll y checkbox de aceptación.
 */
export function LandingPlanLegalConfirmModal({
  plan,
  open,
  onOpenChange,
  onConfirmContinue,
}: Props) {
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (open) setAccepted(false)
  }, [open, plan?.id])

  if (!open || !plan) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="landing-legal-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      <div className="flex max-h-[min(92vh,640px)] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#e8e8e8] bg-white shadow-xl">
        <div className="shrink-0 border-b border-[#eee] p-5 pb-4">
          <h2
            id="landing-legal-title"
            className="text-xl font-semibold tracking-tight text-[#111]"
          >
            Confirmar contratación
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#555]">
            Vas a contratar el plan <strong>{plan.name}</strong>. Serás redirigido a la pasarela de pago
            Bold.
          </p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[#888]">
            Condiciones y restricciones del servicio
          </p>
        </div>

        <div
          className="min-h-0 flex-1 overflow-y-auto border-b border-[#eee] bg-[#fafafa] px-5 py-4"
          tabIndex={0}
          role="region"
          aria-label="Texto de condiciones y restricciones"
        >
          <pre className="whitespace-pre-wrap font-sans text-xs leading-relaxed text-[#333]">
            {SERVICE_TERMS_AND_RESTRICTIONS}
          </pre>
        </div>

        <div className="shrink-0 space-y-4 p-5 pt-4">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#333]">
            <input
              type="checkbox"
              className="mt-1 size-4 shrink-0 rounded border-[#ccc] accent-primary"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked)
              }}
            />
            <span>
              Tengo conocimiento y <span className="font-semibold">acepto las condiciones y restricciones del servicio</span>{' '}
              que he leído en el recuadro anterior.
            </span>
          </label>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              className="h-11 rounded-xl border border-[#ddd] px-4 text-sm font-semibold text-[#444] hover:bg-[#f7f7f7]"
              onClick={() => {
                setAccepted(false)
                onOpenChange(false)
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              disabled={!accepted}
              className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                onConfirmContinue()
                setAccepted(false)
              }}
            >
              Continuar al pago
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
