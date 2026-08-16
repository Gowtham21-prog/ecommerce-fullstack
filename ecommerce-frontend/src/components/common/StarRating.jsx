import Icon from './Icon'
import { formatRating } from '../../utils/formatters'
import './StarRating.css'

export default function StarRating({ rating, reviewCount, size = 14 }) {
  const stars = [1, 2, 3, 4, 5]

  return (
    <div className="star-rating" aria-label={`Rated ${formatRating(rating)} out of 5`}>
      <span className="star-rating__stars">
        {stars.map((n) => (
          <Icon
            key={n}
            name={n <= Math.round(rating) ? 'star' : 'starOutline'}
            size={size}
            className={
              n <= Math.round(rating)
                ? 'star-rating__star star-rating__star--filled'
                : 'star-rating__star'
            }
          />
        ))}
      </span>
      <span className="star-rating__value">{formatRating(rating)}</span>
      {reviewCount != null && (
        <span className="star-rating__count">({reviewCount})</span>
      )}
    </div>
  )
}
