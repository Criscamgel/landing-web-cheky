type Props = { className?: string; iconClassName?: string; size?: number }

export function BrandLogo({ className = '', iconClassName = '', size = 14 }: Props) {
  return (
    <div className={`rounded-lg bg-primary flex items-center justify-center ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="#fff"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={iconClassName}
        aria-hidden
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    </div>
  )
}
