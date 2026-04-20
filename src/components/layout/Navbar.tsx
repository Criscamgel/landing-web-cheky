import { useState, type ReactNode } from 'react'
import { IconMenu } from '@/components/icons/UiIcons'
import type { NavbarContent } from '@/types/landing'

/** Fondo navbar según marca — debe coincidir con `tailwind` primary.DEFAULT */
const NAV_BG = '#157634'

type Props = { content: NavbarContent }

const linkClass =
  'text-[13px] font-medium text-white hover:text-white/90 transition-colors whitespace-nowrap rounded-md px-0.5 py-0.5 hover:bg-white/10'

const ghostButtonClass =
  'inline-flex items-center justify-center rounded-lg border-2 border-white bg-transparent text-white font-semibold text-[13px] px-6 py-2.5 shadow-none transition-colors hover:bg-white/15 active:bg-white/20'

type LoginAnchorProps = {
  href: string
  className?: string
  children: ReactNode
  onClick?: () => void
}

function LoginAnchor({ href, className = '', children, onClick }: LoginAnchorProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${ghostButtonClass} ${className}`.trim()}
      onClick={onClick}
    >
      {children}
    </a>
  )
}

export function Navbar({ content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/15 shadow-[0_2px_14px_rgba(0,0,0,0.18)]"
      style={{ backgroundColor: NAV_BG }}
    >
      {/* Desktop: logo | enlaces centrados | botón; móvil: logo + hamburguesa */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 min-h-[72px] py-3.5 hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-4">
        <a
          href="#"
          className="flex items-center min-w-0 justify-self-start"
          onClick={() => setOpen(false)}
        >
          <img
            src="/navbar-logo.png"
            alt={content.brandName}
            width={398}
            height={172}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="h-14 lg:h-[3.75rem] xl:h-16 w-auto max-w-[min(100%,320px)] object-contain object-left select-none"
          />
        </a>

        <div className="flex items-center justify-center gap-7 lg:gap-9">
          {content.links.map((link) => (
            <a key={link.href + link.label} href={link.href} className={linkClass}>
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex justify-end">
          <LoginAnchor href={content.loginHref}>{content.loginLabel}</LoginAnchor>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 min-h-[56px] py-3 flex md:hidden items-center justify-between gap-4">
        <a
          href="#"
          className="flex items-center min-w-0 shrink"
          onClick={() => setOpen(false)}
        >
          <img
            src="/navbar-logo.png"
            alt={content.brandName}
            width={398}
            height={172}
            decoding="async"
            draggable={false}
            className="h-10 w-auto max-w-[200px] object-contain object-left select-none"
          />
        </a>
        <button
          type="button"
          className="text-white hover:bg-white/10 rounded-md p-1.5 shrink-0 transition-colors"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((v) => !v)}
        >
          <IconMenu />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden border-t border-white/15 overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-[380px] opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{ backgroundColor: NAV_BG }}
      >
        <div className="px-5 py-4 flex flex-col gap-1">
          {content.links.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className={`${linkClass} py-2.5`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <LoginAnchor
            href={content.loginHref}
            className="mt-3 w-full text-center"
            onClick={() => setOpen(false)}
          >
            {content.loginLabel}
          </LoginAnchor>
        </div>
      </div>
    </nav>
  )
}
