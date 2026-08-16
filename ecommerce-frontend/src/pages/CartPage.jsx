import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useToast } from '../components/common/Toast'
import Icon from '../components/common/Icon'
import Button from '../components/common/Button'
import QuantityStepper from '../components/common/QuantityStepper'
import EmptyState from '../components/common/EmptyState'
import { formatPrice } from '../utils/formatters'
import './CartPage.css'

export default function CartPage() {
  const { items, updateQuantity, removeItem, subtotal, itemCount } = useCart()
  const { showToast } = useToast()
  const navigate = useNavigate()

  async function handleQuantityChange(id, quantity) {
    try {
      await updateQuantity(id, quantity)
    } catch (err) {
      showToast(err?.message || 'Could not update quantity', { tone: 'error' })
    }
  }

  async function handleRemove(id) {
    try {
      await removeItem(id)
    } catch (err) {
      showToast(err?.message || 'Could not remove item', { tone: 'error' })
    }
  }

  if (items.length === 0) {
    return (
      <div className="container cart-page">
        <EmptyState
          icon={<Icon name="bag" size={40} />}
          title="Your bag is empty"
          description="Looks like you haven't added anything yet. Explore the collection to find something you'll love."
          actionLabel="Browse products"
          onAction={() => (window.location.href = '/shop')}
        />
      </div>
    )
  }

  const shippingEstimate = subtotal >= 400000 ? 0 : 4900
  const total = subtotal + shippingEstimate

  return (
    <div className="container cart-page">
      <h1 className="cart-page__title">
        Your bag <span>({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
      </h1>

      <div className="cart-page__grid">
        <ul className="cart-page__list">
          {items.map((item) => (
            <li key={item.id} className="cart-page__item">
              <Link to={`/product/${item.slug}`} className="cart-page__item-image">
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
              </Link>
              <div className="cart-page__item-body">
                <div className="cart-page__item-top">
                  <div>
                    <span className="cart-page__item-category">{item.category?.name}</span>
                    <Link to={`/product/${item.slug}`} className="cart-page__item-name">
                      {item.name}
                    </Link>
                  </div>
                  <span className="cart-page__item-price">{formatPrice(item.price)}</span>
                </div>
                <div className="cart-page__item-bottom">
                  <QuantityStepper
                    quantity={item.quantity}
                    onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
                    onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                    max={item.stock}
                  />
                  <button
                    className="cart-page__item-remove"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Icon name="trash" size={15} />
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="cart-page__summary">
          <h2 className="cart-page__summary-title">Order summary</h2>
          <div className="cart-page__summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="cart-page__summary-row">
            <span>Shipping</span>
            <span>{shippingEstimate === 0 ? 'Free' : formatPrice(shippingEstimate)}</span>
          </div>
          {shippingEstimate > 0 && (
            <p className="cart-page__summary-note">
              Add {formatPrice(400000 - subtotal)} more for free shipping.
            </p>
          )}
          <div className="cart-page__summary-divider" />
          <div className="cart-page__summary-row cart-page__summary-row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button
            variant="primary"
            size="lg"
            fullWidth
            className="cart-page__checkout"
            onClick={() => navigate('/checkout')}
          >
            Proceed to checkout
          </Button>
          <Link to="/shop" className="cart-page__continue">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}
