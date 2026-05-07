import { useEffect, useState } from 'react'
import type { PublicPlanDto } from '@/types/publicPlan'

type Props = {
  plan: PublicPlanDto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  termsPdfUrl: string
  onConfirmContinue: () => void
}

/**
 * Confirmación antes de ir a Bold: aceptación de condiciones (enlace a PDF) y CTA negativa/positiva.
 */
export function LandingPlanLegalConfirmModal({
  plan,
  open,
  onOpenChange,
  termsPdfUrl,
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
      <div className="max-h-[min(90vh,560px)] w-full max-w-md overflow-y-auto rounded-2xl border border-[#e8e8e8] bg-white p-6 shadow-xl">
        <h2
          id="landing-legal-title"
          className="mb-2 text-xl font-semibold tracking-tight text-[#111]"
        >
          Confirmar contratación
        </h2>
        <p className="mb-4 text-sm leading-relaxed text-[#555]">
          Vas a contratar el plan <strong>{plan.name}</strong>. Serás redirigido a la pasarela de pago Bold.
        </p>

        <label className="mb-6 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#333]">
          <input
            type="checkbox"
            className="mt-1 size-4 shrink-0 rounded border-[#ccc] accent-primary"
            checked={accepted}
            onChange={(e) => {
              setAccepted(e.target.checked)
            }}
          />
          <span>
            Tengo conocimiento y{' '}
            <a
              href={termsPdfUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-primary underline underline-offset-2"
              onClick={(e) => {
                if (!termsPdfUrl) e.preventDefault()
              }}
            >
              acepto las condiciones y restricciones del servicio
            </a>
            .
          </span>
        </label>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
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
  )
}
