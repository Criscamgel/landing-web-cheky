import { useMemo, useState } from 'react'
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
import { toast } from 'sonner'
import type { ContactDemoPayload } from '@/actions/postContactDemo.action'
import type { ContactHighlightIcon, ContactSectionContent } from '@/types/landing'

type Props = { content: ContactSectionContent }

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

export function ContactSection({ content }: Props) {
  const { mutate, isPending } = useContactDemoMutation()
  const [locked, setLocked] = useState(() => hasContactDemoBeenSentInSession())

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
      <div className="max-w-4xl mx-auto">
        <div className="card-base rounded-2xl p-7 md:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
            <div>
              <span className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] mb-3 block">
                {content.overline}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111] mb-4">
                {content.title}
              </h2>
              <p className="text-sm text-[#888] leading-relaxed mb-8">{content.description}</p>

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

                const payload: ContactDemoPayload = {
                  name: values.name,
                  email: values.email,
                  company: values.company,
                  volume: values.volume,
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

                  <Button
                    type="submit"
                    variant="primary"
                    disabled={locked || isSubmitting || isPending}
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
      </div>
    </section>
  )
}
