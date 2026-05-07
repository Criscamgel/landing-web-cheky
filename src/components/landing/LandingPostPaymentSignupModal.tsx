import { useMemo, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { toast } from 'sonner'
import { requestLandingAdminOnboarding } from '@/actions/requestLandingAdminOnboarding.action'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Id de enlace Bold (mismo que se usó en `postBoldConfirm`). */
  paymentLink: string | null
}

/**
 * Tras pago Bold exitoso: pide correo y envía enlace seguro para registro admin en la webapp.
 */
export function LandingPostPaymentSignupModal({ open, onOpenChange, paymentLink }: Props) {
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const canSubmit = Boolean(paymentLink?.trim())

  const initialEmail = useMemo(() => '', [])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="landing-post-pay-title"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onOpenChange(false)
      }}
    >
      <div className="max-h-[min(90vh,540px)] w-full max-w-md overflow-y-auto rounded-2xl border border-[#e8e8e8] bg-white p-6 shadow-xl">
        <h2
          id="landing-post-pay-title"
          className="mb-2 text-xl font-semibold tracking-tight text-[#111]"
        >
          {sent ? 'Revisa tu correo' : 'Pago recibido'}
        </h2>
        {sent ? (
          <p className="mb-6 text-sm leading-relaxed text-[#555]">
            Te enviamos un correo con un enlace seguro para crear tu empresa y tu usuario administrador.
            Revisa también la carpeta de spam. El enlace caduca en unos días.
          </p>
        ) : (
          <p className="mb-6 text-sm leading-relaxed text-[#555]">
            Ingresa el correo con el que deseas administrar tu cuenta en Cheky. Te enviaremos las
            instrucciones para completar el registro.
            {!canSubmit ? (
              <span className="mt-2 block font-semibold text-[#b45309]">
                No se encontró la referencia del pago. Recarga la página o contacta soporte.
              </span>
            ) : null}
          </p>
        )}

        {!sent ? (
          <Formik
            key={initialEmail}
            initialValues={{ email: initialEmail }}
            validationSchema={Yup.object({
              email: Yup.string()
                .email('Usa un correo válido')
                .required('El correo es obligatorio'),
            })}
            onSubmit={async (values) => {
              if (!paymentLink?.trim()) return
              setSubmitting(true)
              try {
                await requestLandingAdminOnboarding({
                  paymentLink: paymentLink.trim(),
                  email: values.email.trim(),
                })
                setSent(true)
                toast.success('Listo. Revisa tu correo (y spam) para el enlace de registro.')
              } catch (e) {
                toast.error(e instanceof Error ? e.message : 'No se pudo enviar el correo')
              } finally {
                setSubmitting(false)
              }
            }}
          >
            {() => (
              <Form className="space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="landing-post-pay-email"
                    className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-[#888]"
                  >
                    Correo electrónico
                  </label>
                  <Field
                    id="landing-post-pay-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    disabled={!canSubmit || submitting}
                    className="h-11 w-full rounded-xl border border-[#ddd] px-3 text-sm text-[#111] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                    placeholder="tu-correo@empresa.com"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="mt-1 text-xs text-red-600"
                  />
                </div>

                <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={submitting}
                    className="h-11 rounded-xl border border-[#ddd] px-4 text-sm font-semibold text-[#444] hover:bg-[#f7f7f7]"
                    onClick={() => onOpenChange(false)}
                  >
                    Cerrar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || !canSubmit}
                    className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? 'Enviando…' : 'Enviar instrucciones'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        ) : (
          <div className="flex justify-end pt-2">
            <button
              type="button"
              className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:opacity-95"
              onClick={() => {
                setSent(false)
                onOpenChange(false)
              }}
            >
              Entendido
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
