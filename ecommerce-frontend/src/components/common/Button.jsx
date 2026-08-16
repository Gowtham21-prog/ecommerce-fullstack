import { forwardRef } from 'react'
import './Button.css'

/**
 * Shared button used across the app. Renders a <button> by default, or
 * an <a>/<Link>-compatible element when `as` is provided.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    as: Component = 'button',
    fullWidth = false,
    icon = null,
    className = '',
    ...rest
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    icon && !children ? 'btn--icon-only' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <Component ref={ref} className={classes} {...rest}>
      {icon && <span className="btn__icon">{icon}</span>}
      {children && <span className="btn__label">{children}</span>}
    </Component>
  )
})

export default Button
