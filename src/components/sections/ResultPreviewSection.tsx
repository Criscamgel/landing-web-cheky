/**
 * Sección visual informativa: muestra un preview del dashboard con resultado de check.
 * Sin botón de acción — solo comunica visualmente lo que el usuario obtiene.
 */
export function ResultPreviewSection() {
  return (
    <section className="py-16 md:py-20 px-5 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* ─── Left: Text ─── */}
          <div>
            <span className="text-[10px] font-medium text-primary uppercase tracking-[0.2em] mb-3 block">
              Resultado
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111] mb-4">
              Un resultado simple para decisiones rápidas
            </h2>
            <p className="text-sm text-[#666] leading-relaxed mb-6 max-w-md">
              En cuestión de segundos obtienes el score de confiabilidad del comprador,
              junto con un desglose claro de los factores que lo componen. Toda la información
              que necesitas para tomar decisiones informadas sin demoras.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                <span className="text-sm text-[#444]">Score de confiabilidad de 0 a 100 en tiempo real</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                <span className="text-sm text-[#444]">Desglose de factores: email, teléfono, redes, antigüedad</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary-50 border border-primary-100 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-primary" />
                </span>
                <span className="text-sm text-[#444]">Historial y métricas de tu empresa en un solo panel</span>
              </li>
            </ul>
          </div>

          {/* ─── Right: Dashboard Screenshot ─── */}
          <div className="relative flex items-center justify-center">
            <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden shadow-[0_16px_48px_rgba(0,0,0,0.1)] border border-gray-100 bg-surface-50">
              {/* Placeholder — reemplazar src con screenshot del dashboard */}
              <img
                src="/result-preview-mockup.png"
                alt="Vista del dashboard de Cheky con gráficas de análisis y resultado de un check"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                onError={(e) => {
                  const target = e.currentTarget
                  target.style.display = 'none'
                  const parent = target.parentElement
                  if (parent && !parent.querySelector('.result-placeholder')) {
                    const placeholder = document.createElement('div')
                    placeholder.className = 'result-placeholder flex items-center justify-center w-full h-full bg-gradient-to-br from-surface-50 to-primary-50'
                    placeholder.innerHTML = `
                      <div class="text-center px-6">
                        <p class="text-4xl mb-3">📈</p>
                        <p class="text-sm text-[#888] font-medium">Dashboard & Results Preview</p>
                        <p class="text-xs text-[#aaa] mt-1">Sube result-preview-mockup.png a /public</p>
                      </div>
                    `
                    parent.appendChild(placeholder)
                  }
                }}
              />
            </div>
            {/* Decorative blur */}
            <div className="absolute -z-10 -top-6 -left-6 w-40 h-40 bg-primary-100 rounded-full blur-[60px] opacity-40 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  )
}
