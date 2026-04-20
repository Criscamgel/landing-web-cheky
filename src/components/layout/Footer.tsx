import { BrandLogo } from '@/components/icons/BrandLogo'
import { IconLinkedIn, IconTwitter } from '@/components/icons/UiIcons'
import type { FooterContent, SocialIconKey } from '@/types/landing'

type Props = { content: FooterContent }

function SocialIcon({ name }: { name: SocialIconKey }) {
  if (name === 'twitter') return <IconTwitter />
  return <IconLinkedIn />
}

export function Footer({ content }: Props) {
  return (
    <footer className="border-t border-[#e7e7e7] py-10 px-5 bg-white">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <BrandLogo className="w-6 h-6 rounded-md" size={12} />
          <span className="text-xs font-semibold text-[#999]">{content.brandName}</span>
        </div>
        <span className="text-[11px] text-[#bbb]">{content.copyright}</span>
        <div className="flex items-center gap-4">
          {content.socials.map((s) => (
            <a
              key={s.name + s.href}
              href={s.href}
              className="text-[#ccc] hover:text-secondary transition-colors"
              aria-label={s.name}
            >
              <SocialIcon name={s.icon} />
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
