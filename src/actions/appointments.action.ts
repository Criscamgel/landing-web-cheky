import axios from 'axios'
import { landingApi } from '@/api/landingApi'

// ─── Types ───────────────────────────────────────────────────

export interface AppointmentPublicConfig {
  availableDays: number[]
  startHour: string
  endHour: string
  allowedDurations: number[]
  timezone: string
  maxAdvanceDays: number
}

export interface AvailableSlotsDay {
  date: string
  slots: string[]
}

export interface AvailableSlotsResponse {
  month: string
  duration: number
  days: AvailableSlotsDay[]
}

export interface BookAppointmentPayload {
  name: string
  email: string
  company: string
  phone?: string
  date: string
  startTime: string
  duration: number
  turnstileToken?: string
}

export interface BookAppointmentResponse {
  success: boolean
  message: string
  data?: {
    publicId: string
    date: string
    startTime: string
    endTime: string
    duration: number
    meetingLink: string
  }
}

// ─── API Calls ───────────────────────────────────────────────

export async function fetchAppointmentConfig(): Promise<AppointmentPublicConfig> {
  const { data } = await landingApi.get<AppointmentPublicConfig>(
    '/public/appointments/config',
  )
  return data
}

export async function fetchAvailableSlots(
  month: string,
  duration: number,
): Promise<AvailableSlotsResponse> {
  const { data } = await landingApi.get<AvailableSlotsResponse>(
    '/public/appointments/available-slots',
    { params: { month, duration } },
  )
  return data
}

export async function bookAppointment(
  payload: BookAppointmentPayload,
): Promise<BookAppointmentResponse> {
  try {
    const { data } = await landingApi.post<BookAppointmentResponse>(
      '/public/appointments/book',
      payload,
    )
    return data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as { message?: string | string[] }
      const raw = body?.message
      const msg = Array.isArray(raw) ? raw.join('. ') : raw
      throw new Error(msg || error.message || 'No se pudo agendar la cita')
    }
    throw error
  }
}
