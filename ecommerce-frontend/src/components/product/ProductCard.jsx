import { Link, useNavigate } from 'react-router-dom'
import Icon from '../common/Icon'
import Badge from '../common/Badge'
import StarRating from '../common/StarRating'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { formatPrice, calculateDiscountPercent } from '../../utils/formatters'
import './ProductCard.css'

const SWATCH_COLORS = {
  audio: 'var(--color-ink)',
  furniture: 'var(--color-clay)',
  lighting: '#c9a24a',
  kitchen: 'var(--color-moss)',
  stationery: '#7a6a53',
  bags: '#5c4536',
}

export default function ProductCard({ product, index = 0 }) {
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const discount = calculateDiscountPercent(product.price, product.originalPrice)
  const swatch = SWATCH_COLORS[product.category?.slug] || 'var(--color-clay)'
  const lowStock = product.stock > 0 && product.stock <= 5

  async function handleQuickAdd(e) {
    e.preventDefault()
    e.stopPropagation()
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await addItem(product, 1)
      showToast(`${product.name} added to cart`, { tone: 'success' })
    } catch (err) {
      showToast(err?.message || 'Could not add to cart', { tone: 'error' })
    }
  }

  return (
    <article
      className="product-card animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <Link to={`/product/${product.slug}`} className="product-card__link">
        <div className="product-card__swatch" style={{ background: swatch }} aria-hidden="true" />

        <div className="product-card__media">
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            className="product-card__image"
          />
          {product.images?.[1] && (
            <img
              src={product.images[1]}
              alt=""
              loading="lazy"
              aria-hidden="true"
              className="product-card__image product-card__image--hover"
            />
          )}

          <div className="product-card__badges">
            {product.bestseller && <Badge tone="ink">Bestseller</Badge>}
            {discount && <Badge tone="clay">-{discount}%</Badge>}
            {lowStock && <Badge tone="outline">Low stock</Badge>}
          </div>

          <button
            className="product-card__quick-add"
            onClick={handleQuickAdd}
            aria-label={`Add ${product.name} to cart`}
          >
            <Icon name="bag" size={16} />
            <span>Quick add</span>
          </button>
        </div>

        <div className="product-card__body">
          <span className="product-card__category">{product.category?.name}</span>
          <h3 className="product-card__name">{product.name}</h3>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size={12} />
          <div className="product-card__price-row">
            <span className="product-card__price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="product-card__price-original">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
