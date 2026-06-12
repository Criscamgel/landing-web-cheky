import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  fetchAppointmentConfig,
  fetchAvailableSlots,
  bookAppointment,
  type BookAppointmentPayload,
} from '@/actions/appointments.action'

export function useAppointmentConfig() {
  return useQuery({
    queryKey: ['appointment-config'],
    queryFn: fetchAppointmentConfig,
    staleTime: 5 * 60 * 1000,
  })
}

export function useAvailableSlots(month: string, duration: number) {
  return useQuery({
    queryKey: ['available-slots', month, duration],
    queryFn: () => fetchAvailableSlots(month, duration),
    enabled: !!month && !!duration,
    staleTime: 60 * 1000,
  })
}

export function useBookAppointment() {
  return useMutation({
    mutationFn: (payload: BookAppointmentPayload) => bookAppointment(payload),
    retry: false,
    onSuccess: (res) => {
      toast.success(
        res.message ?? 'Tu cita fue agendada. Revisa tu correo.',
      )
    },
    onError: (error: Error) => {
      toast.error(error.message || 'No se pudo agendar la cita')
    },
  })
}
