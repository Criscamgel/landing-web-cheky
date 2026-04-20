import type { FormEvent } from 'react'
import { useState } from 'react'
import { IconArrowRight, IconFile, IconPhone, IconShieldSmall } from '@/components/icons/UiIcons'
import { Button } from '@/components/ui/Button'
import type { ContactHighlightIcon, ContactSectionContent } from '@/types/landing'

type Props = { content: ContactSectionContent }

function HighlightIcon({ name }: { name: ContactHighlightIcon }) {
  const wrap = 'w-8 h-8 rounded-lg bg-secondary-50 border border-secondary-100 flex items-center justify-center flex-shrink-0 mt-0.5'
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
  return (
    <div className={wrap}>
      <IconShieldSmall />
    </div>
  )
}

export function ContactSection({ content }: Props) {
  const [values, setValues] = useState<Record<string, string>>({})

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    // Conectar con Strapi (custom API) o servicio de leads
    console.info('lead', values)
  }

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

            <form className="space-y-4" onSubmit={handleSubmit}>
              {content.fields.map((field) => (
                <div key={field.id}>
                  <label
                    htmlFor={field.id}
                    className="block text-[11px] font-medium text-[#666] mb-1.5"
                  >
                    {field.label}
                  </label>
                  {field.type === 'select' ? (
                    <select
                      id={field.id}
                      className="inp w-full rounded-lg px-3.5 py-2.5 text-sm cursor-pointer text-[#999]"
                      value={values[field.id] ?? ''}
                      onChange={(ev) =>
                        setValues((v) => ({ ...v, [field.id]: ev.target.value }))
                      }
                    >
                      {field.options?.map((opt) => (
                        <option key={opt.value || opt.label} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.id}
                      type={field.type}
                      placeholder={field.placeholder}
                      className="inp w-full rounded-lg px-3.5 py-2.5 text-sm text-[#111]"
                      value={values[field.id] ?? ''}
                      onChange={(ev) =>
                        setValues((v) => ({ ...v, [field.id]: ev.target.value }))
                      }
                    />
                  )}
                </div>
              ))}
              <Button
                type="submit"
                variant="primary"
                className="w-full text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 mt-1"
              >
                {content.submitLabel}
                <IconArrowRight />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
