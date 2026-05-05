import { useMemo, useState } from 'react'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { getWebAppBaseUrl } from '@/lib/runtimeEnv'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

/**
 * Solo landing: tras pago Bold exitoso (`pagoBold=1`), pide correo para continuar acceso en la webapp.
 */
export function LandingPostPaymentSignupModal({ open, onOpenChange }: Props) {
  const [redirecting, setRedirecting] = useState(false)
  const webapp = useMemo(() => getWebAppBaseUrl(), [])
  const canRedirect = Boolean(webapp)

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
          Pago recibido
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-[#555]">
          Ingresa el correo con el que deseas tener tu cuenta en la plataforma Cheky.
          {!canRedirect ? (
            <>
              {' '}
              <span className="font-semibold text-[#333]">
                Configura también <code className="text-xs">VITE_WEB_APP_URL</code> para el enlace automático al
                registro o inicio de sesión.
              </span>
            </>
          ) : null}
        </p>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Usa un correo válido')
              .required('El correo es obligatorio'),
          })}
          onSubmit={(values) => {
            const email = values.email.trim()
            if (!webapp) return
            setRedirecting(true)
            try {
              const dest = `${webapp}/auth/login?from=landing_pay&email=${encodeURIComponent(email)}`
              window.location.assign(dest)
            } finally {
              setRedirecting(false)
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
                  className="h-11 w-full rounded-xl border border-[#ddd] px-3 text-sm text-[#111] outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
                  disabled={redirecting}
                  className="h-11 rounded-xl border border-[#ddd] px-4 text-sm font-semibold text-[#444] hover:bg-[#f7f7f7]"
                  onClick={() => onOpenChange(false)}
                >
                  Cerrar
                </button>
                <button
                  type="submit"
                  disabled={redirecting || !canRedirect}
                  className="h-11 rounded-xl bg-primary px-4 text-sm font-semibold text-white hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {redirecting ? 'Abriendo…' : canRedirect ? 'Continuar en la plataforma' : 'Sin URL configurada'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
