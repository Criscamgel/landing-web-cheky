import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppointmentConfig, useAvailableSlots, useBookAppointment } from '@/hooks/useAppointments'
import { Button } from '@/components/ui/Button'
import { IconArrowRight } from '@/components/icons/UiIcons'
import type { BookAppointmentPayload } from '@/actions/appointments.action'

// ─── Helpers ─────────────────────────────────────────────────

const DAYS_ES = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const MONTHS_ES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
]

function formatMonthYear(year: number, month: number) {
  return `${MONTHS_ES[month]} ${year}`
}

function getMonthStr(year: number, month: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}`
}

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  // Monday-based: 0=Mon ... 6=Sun
  let startOffset = firstDay.getDay() - 1
  if (startOffset < 0) startOffset = 6

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: (number | null)[] = []

  for (let i = 0; i < startOffset; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  return cells
}

function formatReadableDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d)
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  return `${days[dt.getDay()]} ${d} de ${MONTHS_ES[m - 1]} de ${y}`
}

function isWeekday(year: number, month: number, day: number) {
  const d = new Date(year, month, day)
  const dow = d.getDay()
  return dow >= 1 && dow <= 5
}

function isPastDay(year: number, month: number, day: number) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const check = new Date(year, month, day)
  return check < today
}

// ─── Component ───────────────────────────────────────────────

type Step = 'select-slot' | 'confirm'

export function AppointmentScheduler() {
  const { data: config, isLoading: configLoading } = useAppointmentConfig()
  const { mutate: book, isPending: booking } = useBookAppointment()

  const now = new Date()
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDuration, setSelectedDuration] = useState(60)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [step, setStep] = useState<Step>('select-slot')
  const [booked, setBooked] = useState(false)

  // Form fields
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')

  const monthStr = getMonthStr(viewYear, viewMonth)
  const { data: slotsData, isLoading: slotsLoading } = useAvailableSlots(
    monthStr,
    selectedDuration,
  )

  // Duration is fixed at 60 minutes (1 hour)
  useEffect(() => {
    setSelectedDuration(60)
  }, [config])

  const availableDatesSet = useMemo(() => {
    const set = new Set<string>()
    if (slotsData?.days) {
      for (const d of slotsData.days) set.add(d.date)
    }
    return set
  }, [slotsData])

  const slotsForSelectedDate = useMemo(() => {
    if (!selectedDate || !slotsData?.days) return []
    const day = slotsData.days.find((d) => d.date === selectedDate)
    return day?.slots ?? []
  }, [selectedDate, slotsData])

  const calendarDays = useMemo(
    () => getCalendarDays(viewYear, viewMonth),
    [viewYear, viewMonth],
  )

  // Determine if we can go to previous month (don't allow past months)
  const canGoPrev = useMemo(() => {
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()
    // Can go back only if viewing a month after current
    if (viewYear > currentYear) return true
    if (viewYear === currentYear && viewMonth > currentMonth) return true
    return false
  }, [viewYear, viewMonth])

  // Determine max advance (don't allow beyond config.maxAdvanceDays)
  const canGoNext = useMemo(() => {
    const maxDays = config?.maxAdvanceDays ?? 30
    const maxDate = new Date()
    maxDate.setDate(maxDate.getDate() + maxDays)
    const nextMonthStart = new Date(viewYear, viewMonth + 1, 1)
    return nextMonthStart <= maxDate
  }, [viewYear, viewMonth, config])

  const goToPrevMonth = useCallback(() => {
    if (!canGoPrev) return
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
    setSelectedDate(null)
    setSelectedSlot(null)
  }, [viewMonth, canGoPrev])

  const goToNextMonth = useCallback(() => {
    if (!canGoNext) return
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
    setSelectedDate(null)
    setSelectedSlot(null)
  }, [viewMonth, canGoNext])

  const handleDayClick = (day: number) => {
    const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(dateStr)
    setSelectedSlot(null)
    setStep('select-slot')
  }

  const handleSlotClick = (slot: string) => {
    setSelectedSlot(slot)
    setStep('confirm')
  }

  const handleDurationChange = (d: number) => {
    setSelectedDuration(d)
    setSelectedDate(null)
    setSelectedSlot(null)
    setStep('select-slot')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) return

    const payload: BookAppointmentPayload = {
      name: name.trim(),
      email: email.trim(),
      company: company.trim(),
      phone: phone.trim() || undefined,
      date: selectedDate,
      startTime: selectedSlot,
      duration: selectedDuration,
    }

    book(payload, {
      onSuccess: () => setBooked(true),
    })
  }

  // Loading state
  if (configLoading) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-[#888]">
        Cargando disponibilidad…
      </div>
    )
  }

  // Success state
  if (booked) {
    return (
      <div className="card-base rounded-2xl text-center py-12 px-6">
        <div className="text-4xl mb-4">✅</div>
        <h3 className="text-xl font-bold text-[#111] mb-2">
          ¡Cita agendada!
        </h3>
        <p className="text-sm text-[#666] max-w-md mx-auto">
          Tu reunión con el equipo de Cheky fue agendada para el{' '}
          <strong>{selectedDate ? formatReadableDate(selectedDate) : ''}</strong>{' '}
          a las <strong>{selectedSlot}</strong>.
          Revisa tu correo para los detalles y el enlace de la reunión.
        </p>
      </div>
    )
  }

  const allowedDurations = config?.allowedDurations ?? [15, 30, 45, 60]
  const durationLabels: Record<number, string> = {
    15: '15 min',
    30: '30 min',
    45: '45 min',
    60: '1 hora',
  }

  return (
    <div className="card-base grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden">
      {/* ─── Panel Izquierdo: Calendario ─── */}
      <div className="bg-primary-600 text-white p-6 lg:p-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-4">
          <img
            src="/navbar-logo.png"
            alt="Cheky"
            className="h-8 brightness-0 invert"
          />
        </div>
        <h3 className="text-center text-lg font-semibold mb-6">
          Reunión con Team Cheky
        </h3>

        {/* Nav mes */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={goToPrevMonth}
            disabled={!canGoPrev}
            className={`p-1 rounded transition-colors ${
              canGoPrev
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-white/20 cursor-not-allowed'
            }`}
            aria-label="Mes anterior"
          >
            ‹
          </button>
          <span className="text-sm font-medium capitalize">
            {formatMonthYear(viewYear, viewMonth)}
          </span>
          <button
            type="button"
            onClick={goToNextMonth}
            disabled={!canGoNext}
            className={`p-1 rounded transition-colors ${
              canGoNext
                ? 'text-white/70 hover:text-white hover:bg-white/10'
                : 'text-white/20 cursor-not-allowed'
            }`}
            aria-label="Mes siguiente"
          >
            ›
          </button>
        </div>

        {/* Encabezados días */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {DAYS_ES.map((d) => (
            <div key={d} className="text-center text-[10px] font-medium text-white/60 uppercase">
              {d}
            </div>
          ))}
        </div>

        {/* Calendario */}
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day, i) => {
            if (day === null)
              return <div key={`empty-${i}`} className="h-9" />

            const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
            const past = isPastDay(viewYear, viewMonth, day)
            const weekday = isWeekday(viewYear, viewMonth, day)
            const hasSlots = availableDatesSet.has(dateStr)
            const isSelected = dateStr === selectedDate

            // Un día es clickeable si: no es pasado y es día hábil (lun-vie).
            // Si la API ya respondió y ese día NO tiene slots, se muestra deshabilitado visualmente
            // pero aún así permitimos clic para mostrar "no hay horarios".
            const isClickable = !past && weekday

            return (
              <button
                key={dateStr}
                type="button"
                disabled={!isClickable}
                onClick={() => isClickable && handleDayClick(day)}
                className={`h-9 w-full rounded-lg text-sm font-medium transition-all duration-200
                  ${isSelected
                    ? 'bg-white text-primary-700 shadow-sm font-bold'
                    : ''
                  }
                  ${isClickable && !isSelected && hasSlots
                    ? 'text-white hover:bg-white/15 cursor-pointer'
                    : ''
                  }
                  ${isClickable && !isSelected && !hasSlots && !slotsLoading
                    ? 'text-white/40 hover:bg-white/10 cursor-pointer'
                    : ''
                  }
                  ${isClickable && !isSelected && slotsLoading
                    ? 'text-white/70 hover:bg-white/10 cursor-pointer'
                    : ''
                  }
                  ${!isClickable
                    ? 'text-white/20 cursor-not-allowed'
                    : ''
                  }
                `}
              >
                {day}
              </button>
            )
          })}
        </div>

        {/* Loading indicator */}
        {slotsLoading && (
          <p className="text-[11px] text-white/50 text-center mt-3 animate-pulse-slow">
            Consultando disponibilidad…
          </p>
        )}
      </div>

      {/* ─── Panel Derecho: Slots + Form ─── */}
      <div className="bg-white p-6 lg:p-8">
        {step === 'select-slot' && (
          <>
            {/* Ubicación */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-1">
                Ubicación de la reunión
              </p>
              <p className="text-sm text-[#111] flex items-center gap-1.5">
                <span className="text-primary">📍</span> Videollamada (Jitsi Meet)
              </p>
            </div>

            {/* Duración fija */}
            <div className="mb-5">
              <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-1">
                Duración de la reunión
              </p>
              <p className="text-sm text-[#111] font-medium">1 hora</p>
            </div>

            {/* Slots */}
            {selectedDate ? (
              <div>
                <p className="text-[11px] font-semibold text-[#555] uppercase tracking-wider mb-1">
                  ¿A qué hora puedes?
                </p>
                <p className="text-[11px] text-[#888] mb-2">
                  Mostrando horarios para el <strong className="text-[#555]">{formatReadableDate(selectedDate)}</strong>
                </p>
                <p className="text-[10px] text-primary font-medium mb-3">
                  UTC -05:00 Colombia
                </p>

                {slotsLoading ? (
                  <div className="flex items-center gap-2 py-4">
                    <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-[#888]">Cargando horarios…</p>
                  </div>
                ) : slotsForSelectedDate.length === 0 ? (
                  <div className="py-4 px-3 bg-surface-100 rounded-lg">
                    <p className="text-xs text-[#888] text-center">
                      No hay horarios disponibles para este día. Prueba con otra fecha.
                    </p>
                  </div>
                ) : (
                  <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
                    {slotsForSelectedDate.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => handleSlotClick(slot)}
                        className="w-full py-2.5 px-4 rounded-lg border border-[#e0e0e0] text-sm text-[#111] font-medium hover:border-primary hover:bg-primary-50 hover:text-primary-700 transition-all duration-200 text-center"
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center py-8">
                <p className="text-sm text-[#888] text-center max-w-[220px]">
                  Selecciona un día en el calendario para ver los horarios disponibles.
                </p>
              </div>
            )}
          </>
        )}

        {step === 'confirm' && selectedDate && selectedSlot && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="bg-primary-50 border border-primary-100 rounded-lg px-3 py-2.5 mb-4">
              <p className="text-xs text-primary-800 font-medium">
                📅 {formatReadableDate(selectedDate)} — {selectedSlot} ({selectedDuration} min)
              </p>
            </div>

            <div>
              <label htmlFor="apt-name" className="block text-[11px] font-medium text-[#666] mb-1">
                Nombre *
              </label>
              <input
                id="apt-name"
                type="text"
                required
                minLength={2}
                maxLength={120}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="inp w-full rounded-lg px-3.5 py-2.5 text-sm text-[#111]"
              />
            </div>

            <div>
              <label htmlFor="apt-email" className="block text-[11px] font-medium text-[#666] mb-1">
                Email *
              </label>
              <input
                id="apt-email"
                type="email"
                required
                maxLength={254}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@empresa.com"
                className="inp w-full rounded-lg px-3.5 py-2.5 text-sm text-[#111]"
              />
            </div>

            <div>
              <label htmlFor="apt-company" className="block text-[11px] font-medium text-[#666] mb-1">
                Empresa *
              </label>
              <input
                id="apt-company"
                type="text"
                required
                minLength={1}
                maxLength={200}
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nombre de tu empresa"
                className="inp w-full rounded-lg px-3.5 py-2.5 text-sm text-[#111]"
              />
            </div>

            <div>
              <label htmlFor="apt-phone" className="block text-[11px] font-medium text-[#666] mb-1">
                Teléfono (opcional)
              </label>
              <input
                id="apt-phone"
                type="tel"
                maxLength={30}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+57 300 123 4567"
                className="inp w-full rounded-lg px-3.5 py-2.5 text-sm text-[#111]"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setStep('select-slot')}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium border border-[#e0e0e0] text-[#555] hover:bg-surface-50 hover:border-[#ccc] transition-all duration-200"
              >
                ← Volver
              </button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  booking ||
                  !name.trim() ||
                  !email.trim() ||
                  !company.trim()
                }
                className="flex-1 text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
              >
                Confirmar cita
                <IconArrowRight />
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
