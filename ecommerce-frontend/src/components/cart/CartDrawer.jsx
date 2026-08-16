import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { useToast } from '../common/Toast'
import Icon from '../common/Icon'
import Button from '../common/Button'
import QuantityStepper from '../common/QuantityStepper'
import { formatPrice } from '../../utils/formatters'
import './CartDrawer.css'

export default function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, updateQuantity, removeItem, subtotal, itemCount } =
    useCart()
  const { showToast } = useToast()

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

  return (
    <div className={`cart-drawer ${isDrawerOpen ? 'cart-drawer--open' : ''}`} aria-hidden={!isDrawerOpen}>
      <div className="cart-drawer__backdrop" onClick={closeDrawer} />
      <div className="cart-drawer__panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="cart-drawer__header">
          <h2 className="cart-drawer__title">
            Your bag <span className="cart-drawer__count">({itemCount})</span>
          </h2>
          <button className="cart-drawer__close" onClick={closeDrawer} aria-label="Close cart">
            <Icon name="close" size={20} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="cart-drawer__empty">
            <Icon name="bag" size={40} />
            <p>Your bag is empty.</p>
            <Button variant="secondary" onClick={closeDrawer} as={Link} to="/shop">
              Browse products
            </Button>
          </div>
        ) : (
          <>
            <ul className="cart-drawer__list">
              {items.map((item) => (
                <li key={item.id} className="cart-drawer__item">
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={closeDrawer}
                    className="cart-drawer__item-image"
                  >
                    <img src={item.imageUrl} alt={item.name} loading="lazy" />
                  </Link>
                  <div className="cart-drawer__item-body">
                    <div className="cart-drawer__item-top">
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={closeDrawer}
                        className="cart-drawer__item-name"
                      >
                        {item.name}
                      </Link>
                      <button
                        className="cart-drawer__item-remove"
                        onClick={() => handleRemove(item.id)}
                        aria-label={`Remove ${item.name} from cart`}
                      >
                        <Icon name="trash" size={16} />
                      </button>
                    </div>
                    <span className="cart-drawer__item-category">{item.category?.name}</span>
                    <div className="cart-drawer__item-bottom">
                      <QuantityStepper
                        quantity={item.quantity}
                        onDecrease={() => handleQuantityChange(item.id, item.quantity - 1)}
                        onIncrease={() => handleQuantityChange(item.id, item.quantity + 1)}
                        max={item.stock}
                      />
                      <span className="cart-drawer__item-price">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="cart-drawer__footer">
              <div className="cart-drawer__subtotal">
                <span>Subtotal</span>
                <span className="cart-drawer__subtotal-value">{formatPrice(subtotal)}</span>
              </div>
              <p className="cart-drawer__note">Shipping and taxes calculated at checkout.</p>
              <Button variant="primary" size="lg" fullWidth onClick={closeDrawer} as={Link} to="/cart">
                View bag &amp; checkout
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
