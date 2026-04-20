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
  const { variant = 'primary', className = '', children } = props
  const classes = `${variantClass[variant]} ${className}`.trim()

  if ('href' in props && props.href) {
    // Quitar props de diseño; el resto va al <a> (target, rel, onClick, etc.)
    const {
      href,
      variant: _omitV,
      className: _omitC,
      children: _omitCh,
      ...anchorRest
    } = props as AnchorProps
    void _omitV
    void _omitC
    void _omitCh
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    )
  }

  const {
    variant: _omitV2,
    className: _omitC2,
    children: _omitCh2,
    type,
    ...btnRest
  } = props as NativeButtonProps
  void _omitV2
  void _omitC2
  void _omitCh2
  return (
    <button type={type ?? 'button'} className={classes} {...btnRest}>
      {children}
    </button>
  )
}
