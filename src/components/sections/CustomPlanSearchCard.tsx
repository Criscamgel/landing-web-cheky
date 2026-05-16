import { useState } from 'react'

export const PLAN_NOT_FOUND_TOAST =
  'Plan inexistente, comuniquese con su vendedor habitual'

function WandSparklesIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m15 4-1 1 2 2 1-1-2-2Zm-8 8-1 1 2 2 1-1-2-2Zm10 2 1 1 2 2 1-1-2-2ZM9 5 4 10l2 2 5-5-2-2Z" />
      <path d="m19 9 2 2-6 6-2-2 6-6Z" />
      <path d="M5 3 3 5" />
      <path d="M21 3 19 5" />
      <path d="M5 21 3 19" />
    </svg>
  )
}

function HelpCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.25a2.75 2.75 0 1 1 4.5 2.12c-.82.55-1.25 1.1-1.25 2.13V14" />
      <circle cx="12" cy="17.25" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  )
}

type CustomPlanSearchCardProps = {
  onSearch: (planName: string) => Promise<void>
  disabled?: boolean
}

export function CustomPlanSearchCard({
  onSearch,
  disabled = false,
}: CustomPlanSearchCardProps) {
  const [planName, setPlanName] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (disabled || isSearching || !planName.trim()) return
    setIsSearching(true)
    try {
      await onSearch(planName.trim())
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <article className="card-base flex min-h-[22rem] flex-col overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
      <div className="h-1.5 w-full bg-primary" aria-hidden />
      <form onSubmit={(e) => void handleSubmit(e)} className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-start gap-3">
          <div
            className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary"
            aria-hidden
          >
            <WandSparklesIcon className="size-5" />
          </div>
          <div className="min-w-0 pt-0.5">
            <h3 className="text-base font-bold leading-snug text-[#111]">Plan a tu medida</h3>
            <p className="mt-1 text-xs leading-relaxed text-[#888]">
              Diligencia el nombre del plan proveido por el vendedor
            </p>
          </div>
        </div>

        <div className="mb-5 border-t border-[#e7e7e7]" />

        <label className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-[#888]">
          Nombre del plan
        </label>
        <input
          type="text"
          value={planName}
          onChange={(e) => setPlanName(e.target.value)}
          placeholder="Ej: Plan Empresarial Pro"
          disabled={disabled || isSearching}
          className="inp mb-5 w-full rounded-xl px-4 py-3 text-sm text-[#111] disabled:opacity-60"
          autoComplete="off"
        />

        <button
          type="submit"
          disabled={disabled || isSearching || !planName.trim()}
          className="btn-primary mb-5 w-full rounded-full py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSearching ? 'Buscando…' : 'Buscar plan'}
        </button>

        <p className="mt-auto flex items-center justify-center gap-1.5 text-center text-[11px] text-[#aaa]">
          <HelpCircleIcon className="size-3.5 shrink-0" />
          <span>Si no tienes el nombre, contacta a tu vendedor</span>
        </p>
      </form>
    </article>
  )
}
