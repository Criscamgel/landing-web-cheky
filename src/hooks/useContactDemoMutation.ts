import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  postContactDemo,
  type ContactDemoPayload,
} from '@/actions/postContactDemo.action'
import { markContactDemoSentInSession } from '@/lib/contactDemoSession'

export function useContactDemoMutation() {
  return useMutation({
    mutationFn: (payload: ContactDemoPayload) => postContactDemo(payload),
    retry: false,
    onSuccess: (envelope) => {
      markContactDemoSentInSession()
      toast.success(
        envelope.message ??
          'Solicitud enviada correctamente. Te contactaremos pronto.',
      )
    },
    onError: (error: Error) => {
      toast.error(error.message || 'No se pudo enviar la solicitud')
    },
  })
}
