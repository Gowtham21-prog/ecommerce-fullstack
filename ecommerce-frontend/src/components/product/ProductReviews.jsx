import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import Icon from '../common/Icon'
import Button from '../common/Button'
import EmptyState from '../common/EmptyState'
import * as reviewService from '../../services/reviewService'
import './ProductReviews.css'

function StarInput({ value, onChange }) {
  return (
    <div className="product-reviews__star-input" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={n === value}
          aria-label={`${n} star${n > 1 ? 's' : ''}`}
          className="product-reviews__star-btn"
          onClick={() => onChange(n)}
        >
          <Icon name={n <= value ? 'star' : 'starOutline'} size={22} />
        </button>
      ))}
    </div>
  )
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

export default function ProductReviews({ productId }) {
  const { user, isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [reviews, setReviews] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    reviewService
      .getReviews(productId)
      .then((data) => {
        if (cancelled) return
        setReviews(data)
        const mine = data.find((r) => r.userId === user?.id)
        if (mine) {
          setRating(mine.rating)
          setComment(mine.comment || '')
        }
      })
      .catch(() => {})
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId])

  const myReview = reviews.find((r) => r.userId === user?.id)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    if (rating < 1) {
      showToast('Please select a star rating', { tone: 'error' })
      return
    }
    setIsSubmitting(true)
    try {
      const saved = await reviewService.submitReview(productId, { rating, comment }, user)
      setReviews((prev) => {
        const idx = prev.findIndex((r) => r.userId === user?.id)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = saved
          return next
        }
        return [saved, ...prev]
      })
      showToast(myReview ? 'Review updated' : 'Review submitted', { tone: 'success' })
    } catch (err) {
      showToast(err?.message || 'Could not submit review', { tone: 'error' })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!myReview) return
    try {
      await reviewService.deleteReview(myReview.id)
      setReviews((prev) => prev.filter((r) => r.id !== myReview.id))
      setRating(0)
      setComment('')
      showToast('Review deleted')
    } catch (err) {
      showToast(err?.message || 'Could not delete review', { tone: 'error' })
    }
  }

  return (
    <section className="product-reviews">
      <h2 className="product-reviews__title">
        Customer reviews <span>({reviews.length})</span>
      </h2>

      <div className="product-reviews__layout">
        <form className="product-reviews__form" onSubmit={handleSubmit}>
          <h3>{myReview ? 'Update your review' : 'Write a review'}</h3>
          <StarInput value={rating} onChange={setRating} />
          <textarea
            className="product-reviews__textarea"
            placeholder="Share your thoughts about this product…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={2000}
            rows={4}
          />
          <div className="product-reviews__form-actions">
            <Button type="submit" variant="primary" disabled={isSubmitting}>
              {myReview ? 'Update review' : 'Submit review'}
            </Button>
            {myReview && (
              <Button type="button" variant="secondary" onClick={handleDelete}>
                Delete
              </Button>
            )}
          </div>
          {!isAuthenticated && (
            <p className="product-reviews__hint">You'll need to log in to submit a review.</p>
          )}
        </form>

        <div className="product-reviews__list">
          {isLoading ? (
            <p className="product-reviews__hint">Loading reviews…</p>
          ) : reviews.length === 0 ? (
            <EmptyState
              icon={<Icon name="starOutline" size={32} />}
              title="No reviews yet"
              description="Be the first to share what you think about this product."
            />
          ) : (
            <ul>
              {reviews.map((review) => (
                <li key={review.id} className="product-reviews__item">
                  <div className="product-reviews__item-head">
                    <span className="product-reviews__item-name">{review.userName}</span>
                    <span className="product-reviews__item-date">{formatDate(review.createdAt)}</span>
                  </div>
                  <div className="product-reviews__item-stars">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Icon
                        key={n}
                        name={n <= review.rating ? 'star' : 'starOutline'}
                        size={14}
                      />
                    ))}
                  </div>
                  {review.comment && <p className="product-reviews__item-comment">{review.comment}</p>}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
