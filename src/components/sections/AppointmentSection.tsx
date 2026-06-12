import { useState, useEffect, useCallback } from 'react'
import { getPublicApiBaseUrl } from '@/lib/runtimeEnv'

type TimeSlot = { startAt: string; endAt: string; available: boolean }

const DURATIONS = [
  { value: 15, label: '15 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hora' },
]

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/Bogota',
  })
}

function formatDateLabel(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00')
  return d.toLocaleDateString('es-CO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Bogota',
  })
}

function getMonthDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startPad = (firstDay.getDay() + 6) % 7 // lunes = 0
  const days: (number | null)[] = []
  for (let i = 0; i < startPad; i++) days.push(null)
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(d)
  return days
}

const WEEKDAYS = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export function AppointmentSection() {
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [month, setMonth] = useState(() => new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [duration, setDuration] = useState(30)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  // Form
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [canSchedule, setCanSchedule] = useState(true)

  const baseUrl = getPublicApiBaseUrl()

  // Fetch slots when date or duration changes
  const fetchSlots = useCallback(async () => {
    if (!selectedDate) return
    setLoadingSlots(true)
    setSelectedSlot(null)
    try {
      const res = await fetch(`${baseUrl}/public/appointments/slots?date=${selectedDate}&duration=${duration}`)
      const json = await res.json()
      const data = json.data ?? json
      setSlots(Array.isArray(data) ? data.filter((s: TimeSlot) => s.available) : [])
    } catch {
      setSlots([])
    } finally {
      setLoadingSlots(false)
    }
  }, [selectedDate, duration, baseUrl])

  useEffect(() => { fetchSlots() }, [fetchSlots])

  // Check if email can schedule
  useEffect(() => {
    if (!email || !email.includes('@')) { setCanSchedule(true); return }
    const timeout = setTimeout(async () => {
      try {
        const res = await fetch(`${baseUrl}/public/appointments/can-schedule?email=${encodeURIComponent(email)}`)
        const json = await res.json()
        const data = json.data ?? json
        setCanSchedule(data.canSchedule !== false)
      } catch { setCanSchedule(true) }
    }, 500)
    return () => clearTimeout(timeout)
  }, [email, baseUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSlot || !name.trim() || !email.trim() || !phone.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/public/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          startAt: selectedSlot.startAt,
          durationMinutes: duration,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        throw new Error(json.message || 'No se pudo agendar la cita.')
      }
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al agendar.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDateClick = (day: number) => {
    const d = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    setSelectedDate(d)
  }

  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`

  const days = getMonthDays(year, month)

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1) }
    else setMonth(month - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1) }
    else setMonth(month + 1)
  }

  if (success) {
    return (
      <section id="agendar" className="py-16 px-5 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-4">✅</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cita confirmada!</h2>
          <p className="text-gray-600">Revisa tu correo electrónico para ver los detalles y el link de la videollamada.</p>
        </div>
      </section>
    )
  }

  return (
    <section id="agendar" className="py-16 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-sm font-semibold tracking-widest uppercase text-[#157634] mb-2">Agenda tu reunión</p>
          <h2 className="text-3xl font-bold text-gray-900">Reunión con Team Cheky</h2>
          <p className="text-gray-500 mt-2">Elige la fecha y hora que mejor te funcione</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendario */}
          <div className="bg-[#1a2e1a] rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <button onClick={prevMonth} className="p-2 hover:bg-white/10 rounded-full">&lt;</button>
              <span className="font-semibold">{MONTHS[month]} {year}</span>
              <button onClick={nextMonth} className="p-2 hover:bg-white/10 rounded-full">&gt;</button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 mb-2">
              {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {days.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                const isPast = dateStr < todayStr
                const isSelected = dateStr === selectedDate
                const isToday = dateStr === todayStr
                const dayOfWeek = new Date(year, month, day).getDay()
                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6

                return (
                  <button
                    key={day}
                    disabled={isPast || isWeekend}
                    onClick={() => handleDateClick(day)}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      isSelected ? 'bg-[#157634] text-white font-bold' :
                      isToday ? 'border border-[#157634] text-white' :
                      isPast || isWeekend ? 'text-gray-600 cursor-not-allowed' :
                      'hover:bg-white/10 text-white'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Panel derecho */}
          <div>
            {/* Duración */}
            <div className="mb-6">
              <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-2">¿Cuánto tiempo necesitas?</p>
              <div className="flex gap-2 flex-wrap">
                {DURATIONS.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      duration === d.value ? 'bg-[#157634] text-white border-[#157634]' : 'bg-white text-gray-700 border-gray-300 hover:border-[#157634]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slots */}
            {selectedDate && (
              <div className="mb-6">
                <p className="text-xs font-semibold tracking-widest uppercase text-gray-500 mb-1">¿A qué hora puedes?</p>
                <p className="text-sm text-gray-500 mb-3">Mostrando horarios para el <strong>{formatDateLabel(selectedDate)}</strong></p>
                <p className="text-xs text-[#157634] mb-3">UTC -05:00 Colombia</p>

                {loadingSlots ? (
                  <p className="text-sm text-gray-400">Cargando horarios...</p>
                ) : slots.length === 0 ? (
                  <div className="border border-red-200 rounded-lg p-4 text-center text-sm text-red-500">
                    No hay horarios disponibles para este día. Prueba con otra fecha.
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {slots.map((slot) => (
                      <button
                        key={slot.startAt}
                        onClick={() => setSelectedSlot(slot)}
                        className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
                          selectedSlot?.startAt === slot.startAt
                            ? 'bg-[#157634] text-white border-[#157634]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-[#157634]'
                        }`}
                      >
                        {formatTime(slot.startAt)}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Formulario */}
            {selectedSlot && (
              <form onSubmit={handleSubmit} className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#157634]"
                    placeholder="Tu nombre completo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correo *</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#157634]"
                    placeholder="tu@correo.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Celular *</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#157634]"
                    placeholder="300 123 4567"
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}

                {!canSchedule && (
                  <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                    Ya tienes una cita agendada este mes. Podrás agendar nuevamente el próximo mes.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !canSchedule}
                  className="w-full py-3 bg-[#157634] text-white font-semibold rounded-lg hover:bg-[#125e2a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Agendando...' : 'Confirmar cita'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
