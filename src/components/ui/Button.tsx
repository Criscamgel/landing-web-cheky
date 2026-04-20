import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'inverted' | 'outlined'

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  inverted: 'btn-inverted',
  outlined: 'btn-outlined',
}

type BaseProps = {
  variant?: Variant
  className?: string
  children: ReactNode
}

type AnchorProps = BaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseProps> & {
    href: string
  }

type NativeButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseProps> & {
    href?: undefined
  }

export type ButtonProps = AnchorProps | NativeButtonProps

export function Button(props: ButtonProps) {
  const { variant = 'primary', className = '', children, ...rest } = props
  const classes = `${variantClass[variant]} ${className}`.trim()

  if ('href' in props && props.href) {
    const { href, ...a } = rest as AnchorProps
    return (
      <a href={href} className={classes} {...a}>
        {children}
      </a>
    )
  }

  const btn = rest as NativeButtonProps
  return (
    <button type={btn.type ?? 'button'} className={classes} {...btn}>
      {children}
    </button>
  )
}
