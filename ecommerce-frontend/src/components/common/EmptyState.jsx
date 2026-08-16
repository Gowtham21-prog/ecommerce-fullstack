import Button from './Button'
import './EmptyState.css'

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = null,
}) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {actionLabel && onAction && (
        <Button variant="secondary" onClick={onAction} className="empty-state__action">
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
