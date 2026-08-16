import { useState, useEffect } from 'react'
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom'
import { useProduct } from '../hooks/useProduct'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import Icon from '../components/common/Icon'
import Badge from '../components/common/Badge'
import Button from '../components/common/Button'
import StarRating from '../components/common/StarRating'
import QuantityStepper from '../components/common/QuantityStepper'
import Skeleton from '../components/common/Skeleton'
import EmptyState from '../components/common/EmptyState'
import ProductReviews from '../components/product/ProductReviews'
import * as wishlistService from '../services/wishlistService'
import { formatPrice, calculateDiscountPercent } from '../utils/formatters'
import './ProductDetailPage.css'

const ACCORDIONS = [
  {
    title: 'Materials & care',
    body: 'Made from responsibly sourced materials. Wipe clean with a dry cloth; avoid direct sunlight for extended periods. Full care guide included with delivery.',
  },
  {
    title: 'Shipping & returns',
    body: 'Free shipping on orders over ₹4,000. Delivered in 5–9 business days. 30-day returns on unused items in original packaging.',
  },
  {
    title: 'Warranty',
    body: 'Covered by our 2-year workmanship guarantee against manufacturing defects. See our care guide for repair support.',
  },
]

export default function ProductDetailPage() {
  const { slug } = useParams()
  const { product, isLoading, error } = useProduct(slug)
  const { addItem } = useCart()
  const { isAuthenticated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [openAccordion, setOpenAccordion] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishlistBusy, setWishlistBusy] = useState(false)

  useEffect(() => {
    if (!isAuthenticated || !product) {
      setIsWishlisted(false)
      return
    }
    let cancelled = false
    wishlistService
      .getWishlist()
      .then((list) => {
        if (!cancelled) setIsWishlisted(list.some((w) => w.product.id === product.id))
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, product])

  if (error?.status === 404) {
    return <Navigate to="/shop" replace />
  }

  if (isLoading || !product) {
    return (
      <div className="container product-detail product-detail--loading">
        <Skeleton variant="block" className="product-detail__skeleton-image" />
        <div className="product-detail__skeleton-info">
          <Skeleton variant="text" style={{ width: '30%' }} />
          <Skeleton variant="text" style={{ width: '70%', height: 32 }} />
          <Skeleton variant="text" style={{ width: '40%' }} />
          <Skeleton variant="text" style={{ width: '100%', height: 80 }} />
        </div>
      </div>
    )
  }

  const discount = calculateDiscountPercent(product.price, product.originalPrice)
  const images = product.images?.length ? product.images : [product.imageUrl]
  const outOfStock = product.stock === 0

  async function handleAddToCart() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    try {
      await addItem(product, quantity)
      showToast(`${product.name} added to cart`, { tone: 'success' })
    } catch (err) {
      showToast(err?.message || 'Could not add to cart', { tone: 'error' })
    }
  }

  async function handleToggleWishlist() {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setWishlistBusy(true)
    try {
      if (isWishlisted) {
        await wishlistService.removeFromWishlist(product.id)
        setIsWishlisted(false)
        showToast('Removed from wishlist')
      } else {
        await wishlistService.addToWishlist(product.id)
        setIsWishlisted(true)
        showToast('Added to wishlist', { tone: 'success' })
      }
    } catch (err) {
      showToast(err?.message || 'Could not update wishlist', { tone: 'error' })
    } finally {
      setWishlistBusy(false)
    }
  }

  return (
    <div className="container product-detail">
      <nav className="product-detail__breadcrumb" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <Icon name="chevronRight" size={12} />
        <Link to="/shop">Shop</Link>
        <Icon name="chevronRight" size={12} />
        <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link>
      </nav>

      <div className="product-detail__grid">
        <div className="product-detail__gallery">
          <div className="product-detail__main-image">
            <img src={images[activeImage]} alt={product.name} />
            {discount && (
              <span className="product-detail__discount-badge">
                <Badge tone="clay">-{discount}%</Badge>
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="product-detail__thumbs">
              {images.map((img, i) => (
                <button
                  key={img}
                  className={`product-detail__thumb ${
                    i === activeImage ? 'product-detail__thumb--active' : ''
                  }`}
                  onClick={() => setActiveImage(i)}
                  aria-label={`View image ${i + 1}`}
                >
                  <img src={img} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="product-detail__info">
          <span className="product-detail__category">{product.category.name}</span>
          <h1 className="product-detail__name">{product.name}</h1>
          <StarRating rating={product.rating} reviewCount={product.reviewCount} size={16} />

          <div className="product-detail__price-row">
            <span className="product-detail__price">{formatPrice(product.price)}</span>
            {product.originalPrice && (
              <span className="product-detail__price-original">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <p className="product-detail__description">{product.description}</p>

          <div className="product-detail__stock">
            {outOfStock ? (
              <Badge tone="outline">Out of stock</Badge>
            ) : product.stock <= 5 ? (
              <span className="product-detail__stock-text product-detail__stock-text--low">
                Only {product.stock} left in stock
              </span>
            ) : (
              <span className="product-detail__stock-text">
                <Icon name="check" size={14} /> In stock, ready to ship
              </span>
            )}
          </div>

          <div className="product-detail__actions">
            <QuantityStepper
              quantity={quantity}
              onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
              onIncrease={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              max={product.stock || 1}
              size="lg"
            />
            <Button
              variant="primary"
              size="lg"
              onClick={handleAddToCart}
              disabled={outOfStock}
              icon={<Icon name="bag" size={18} />}
              fullWidth
            >
              {outOfStock ? 'Out of stock' : 'Add to cart'}
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={handleToggleWishlist}
              disabled={wishlistBusy}
              icon={<Icon name={isWishlisted ? 'heart' : 'heartOutline'} size={18} />}
              aria-pressed={isWishlisted}
            >
              {isWishlisted ? 'Saved' : 'Save'}
            </Button>
          </div>

          <div className="product-detail__accordions">
            {ACCORDIONS.map((item, i) => (
              <div key={item.title} className="accordion">
                <button
                  className="accordion__trigger"
                  onClick={() => setOpenAccordion(openAccordion === i ? -1 : i)}
                  aria-expanded={openAccordion === i}
                >
                  <span>{item.title}</span>
                  <Icon
                    name="chevronDown"
                    size={16}
                    className={openAccordion === i ? 'accordion__chevron--open' : ''}
                  />
                </button>
                <div
                  className="accordion__content"
                  style={{ maxHeight: openAccordion === i ? '200px' : '0px' }}
                >
                  <p>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} />
    </div>
  )
}
