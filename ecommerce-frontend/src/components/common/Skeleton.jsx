import './Skeleton.css'

export default function Skeleton({ variant = 'block', className = '', style }) {
  return <div className={`skeleton skeleton--${variant} ${className}`} style={style} />
}

export function ProductCardSkeleton() {
  return (
    <div className="skeleton-card">
      <Skeleton variant="block" className="skeleton-card__image" />
      <Skeleton variant="text" className="skeleton-card__line skeleton-card__line--60" />
      <Skeleton variant="text" className="skeleton-card__line skeleton-card__line--40" />
      <Skeleton variant="text" className="skeleton-card__line skeleton-card__line--30" />
    </div>
  )
}
