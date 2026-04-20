import { useState } from 'react'
import { IconMenu } from '@/components/icons/UiIcons'
import { Button } from '@/components/ui/Button'
import type { NavbarContent } from '@/types/landing'

type Props = { content: NavbarContent }

export function Navbar({ content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#e7e7e7] bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/90">
      <div className="max-w-6xl mx-auto px-5 min-h-14 md:min-h-16 py-2.5 md:py-3 flex items-center justify-between">
        <a
          href="#"
          className="flex items-center shrink-0 min-w-0"
          onClick={() => setOpen(false)}
        >
          {/* Mobile: icono + marca */}
          <span className="flex md:hidden items-center gap-2.5">
            <img
              src="/favicon-96x96.png"
              alt=""
              width={32}
              height={32}
              decoding="async"
              draggable={false}
              className="h-8 w-8 object-contain select-none"
            />
            <span className="text-[15px] font-bold tracking-tight text-[#111]">
              {content.brandName}
            </span>
          </span>

          {/* Desktop: PNG de marca (827×355), sin recortes de pantalla */}
          <img
            src="/logo-cheky-desktop.png"
            alt={content.brandName}
            width={827}
            height={355}
            decoding="async"
            fetchPriority="high"
            draggable={false}
            className="hidden md:block h-12 lg:h-[52px] w-auto max-w-[min(100%,260px)] object-contain object-left select-none"
          />
        </a>

        <div className="hidden md:flex items-center gap-7">
          {content.links.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className="text-[12px] font-medium text-[#666] hover:text-[#111] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button
            href={content.loginHref}
            variant="primary"
            className="text-[11px] font-semibold px-4 py-2 rounded-lg inline-block"
            target="_blank"
            rel="noopener noreferrer"
          >
            {content.loginLabel}
          </Button>
        </div>

        <button
          type="button"
          className="md:hidden text-[#666] hover:text-[#111] transition-colors shrink-0"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
        >
          <IconMenu />
        </button>
      </div>

      <div
        id="mobile-menu"
        className={`md:hidden bg-white/95 backdrop-blur-sm border-b border-[#e7e7e7] overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-[320px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 py-4 flex flex-col gap-3">
          {content.links.map((link) => (
            <a
              key={link.href + link.label}
              href={link.href}
              className="text-sm text-[#666] hover:text-[#111] py-1.5 transition-colors"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <Button
            href={content.loginHref}
            variant="primary"
            className="text-xs font-semibold px-4 py-2.5 rounded-lg text-center mt-1 inline-block w-full"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            {content.loginLabel}
          </Button>
        </div>
      </div>
    </nav>
  )
}
