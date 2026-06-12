import { useMemo, useState } from 'react'
import { TurnstileField } from '@/components/security/TurnstileField'
import { isTurnstileConfigured } from '@/lib/turnstile.config'
import { ErrorMessage, Field, Form, Formik } from 'formik'
import {
  IconArrowRight,
  IconFile,
  IconMail,
  IconPhone,
  IconShieldSmall,
} from '@/components/icons/UiIcons'
import { Button } from '@/components/ui/Button'
import { useContactDemoMutation } from '@/hooks/useContactDemoMutation'
import { buildContactDemoSchema } from '@/lib/contactDemo.schema'
import { hasContactDemoBeenSentInSession } from '@/lib/contactDemoSession'
import { AppointmentScheduler } from '@/components/sections/AppointmentScheduler'
import { toast } from 'sonner'
import type { ContactDemoPayload } from '@/actions/postContactDemo.action'
import type { ContactHighlightIcon, ContactSectionContent } from '@/types/landing'

type Props = { content: ContactSectionContent }

type ContactTab = 'form' | 'appointment'

function HighlightIcon({ name }: { name: ContactHighlightIcon }) {
  const wrap =
    'w-8 h-8 rounded-lg bg-secondary-50 border border-secondary-100 flex items-center justify-center flex-shrink-0 mt-0.5'
  if (name === 'phone')
    return (
      <div className={wrap}>
        <IconPhone />
      </div>
    )
  if (name === 'file')
    return (
      <div className={wrap}>
        <IconFile />
      </div>
    )
  if (name === 'mail')
    return (
      <div className={wrap}>
        <IconMail />
      </div>
    )
  return (
    <div className={wrap}>
      <IconShieldSmall />
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all text-center
        ${active
          ? 'bg-primary-50 border-primary-300 text-primary-700 border shadow-sm'
          : 'bg-gray-50 border border-gray-200 text-[#666] hover:bg-gray-100'
        }
      `}
    >
      {children}
    </button>
  )
}

export function ContactSection({ content }: Props) {
  const { mutate, isPending } = useContactDemoMutation()
  const [locked, setLocked] = useState(() => hasContactDemoBeenSentInSession())
  const [turnstileToken, setTurnstileToken] = useState('')
  const turnstileRequired = isTurnstileConfigured()
  const [activeTab, setActiveTab] = useState<ContactTab>('form')

  const initialValues = useMemo(() => {
    const o: Record<string, string> = {}
    for (const f of content.fields) {
      o[f.id] = ''
    }
    return o
  }, [content.fields])

  const validationSchema = useMemo(
    () => buildContactDemoSchema(content.fields),
    [content.fields],
  )

  return (
    <section id="contacto" className="py-16 px-5 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* ─── Section Header ─── */}
        <div className="text-center mb-8">
          <span className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] mb-3 block">
            {content.overline}
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111] mb-3">
            ¿Cómo prefieres contactarnos?
          </h2>
          <p className="text-sm text-[#888] leading-relaxed max-w-lg mx-auto">
            {content.description}
          </p>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-3 mb-8 max-w-lg mx-auto">
          <TabButton
            active={activeTab === 'form'}
            onClick={() => setActiveTab('form')}
          >
            📩 Quiero que me contacten
          </TabButton>
          <TabButton
            active={activeTab === 'appointment'}
            onClick={() => setActiveTab('appointment')}
          >
            📅 Agendar una cita
          </TabButton>
        </div>

        {/* ─── Tab Content ─── */}
        {activeTab === 'form' && (
          <div className="card-base rounded-2xl p-7 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
              <div>
                <h3 className="text-xl font-bold tracking-tight text-[#111] mb-4">
                  {content.title}
                </h3>
                <p className="text-sm text-[#888] leading-relaxed mb-8">
                  Te contactamos en menos de 24 horas para mostrarte cómo Cheky puede ayudarte.
                </p>

                <div className="space-y-5">
                  {content.highlights.map((h) => (
                    <div key={h.title} className="flex items-start gap-3">
                      <HighlightIcon name={h.icon} />
                      <div>
                        <div className="text-xs font-medium text-[#111]">{h.title}</div>
                        <div className="text-[11px] text-[#999]">{h.subtitle}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                validateOnBlur
                onSubmit={(values, { setSubmitting }) => {
                  if (locked) {
                    toast.info(
                      'Ya enviaste una solicitud en esta sesión. Si necesitas otro contacto, abre una ventana privada o escríbenos a hola@cheky.co',
                    )
                    setSubmitting(false)
                    return
                  }

                  if (turnstileRequired && !turnstileToken.trim()) {
                    toast.error('Completa la verificación de seguridad.')
                    setSubmitting(false)
                    return
                  }

                  const payload: ContactDemoPayload = {
                    name: values.name,
                    email: values.email,
                    company: values.company,
                    volume: values.volume,
                    ...(turnstileToken.trim()
                      ? { turnstileToken: turnstileToken.trim() }
                      : {}),
                  }

                  mutate(payload, {
                    onSuccess: () => {
                      setLocked(true)
                    },
                    onSettled: () => setSubmitting(false),
                  })
                }}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-4">
                    {locked ? (
                      <p className="text-sm text-primary-700 bg-primary-50 border border-primary-100 rounded-lg px-3 py-2.5">
                        Ya enviaste tu solicitud desde este navegador. El equipo te contactará pronto.
                      </p>
                    ) : null}

                    {content.fields.map((field) => (
                      <div key={field.id}>
                        <label
                          htmlFor={field.id}
                          className="block text-[11px] font-medium text-[#666] mb-1.5"
                        >
                          {field.label}
                        </label>
                        {field.type === 'select' ? (
                          <Field
                            as="select"
                            id={field.id}
                            name={field.id}
                            disabled={locked}
                            className="inp w-full rounded-lg px-3.5 py-2.5 text-sm cursor-pointer text-[#111] disabled:opacity-60"
                          >
                            {field.options?.map((opt) => (
                              <option key={opt.value || opt.label} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Field>
                        ) : (
                          <Field
                            id={field.id}
                            name={field.id}
                            type={field.type}
                            placeholder={field.placeholder}
                            disabled={locked}
                            className="inp w-full rounded-lg px-3.5 py-2.5 text-sm text-[#111] disabled:opacity-60"
                          />
                        )}
                        <ErrorMessage
                          name={field.id}
                          component="p"
                          className="text-xs text-red-600 mt-1"
                        />
                      </div>
                    ))}

                    <TurnstileField
                      className="flex justify-center pt-1"
                      onToken={setTurnstileToken}
                    />

                    <Button
                      type="submit"
                      variant="primary"
                      disabled={
                        locked ||
                        isSubmitting ||
                        isPending ||
                        (turnstileRequired && !turnstileToken.trim())
                      }
                      className="w-full text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 mt-1 opacity-100 disabled:opacity-50 disabled:pointer-events-none"
                    >
                      {content.submitLabel}
                      <IconArrowRight />
                    </Button>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        )}

        {activeTab === 'appointment' && (
          <div className="max-w-4xl mx-auto">
            <AppointmentScheduler />
          </div>
        )}
      </div>
    </section>
  )
}
