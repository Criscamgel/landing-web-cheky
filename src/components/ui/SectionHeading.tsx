type Props = {
  overline?: string
  overlineClassName?: string
  title: string
  subtitle?: string
  className?: string
}

export function SectionHeading({
  overline,
  overlineClassName = 'text-primary',
  title,
  subtitle,
  className = '',
}: Props) {
  return (
    <div className={`text-center mb-12 ${className}`}>
      {overline ? (
        <span
          className={`text-[10px] font-medium uppercase tracking-[0.2em] mb-3 block ${overlineClassName}`}
        >
          {overline}
        </span>
      ) : null}
      <h2
        className={`text-2xl md:text-3xl font-bold tracking-tight text-[#111] ${subtitle ? 'mb-3' : ''}`}
      >
        {title}
      </h2>
      {subtitle ? <p className="text-sm text-[#888] max-w-md mx-auto">{subtitle}</p> : null}
    </div>
  )
}
