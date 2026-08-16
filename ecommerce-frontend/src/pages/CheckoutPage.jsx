import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import Button from '../components/common/Button'
import * as orderService from '../services/orderService'
import { formatPrice } from '../utils/formatters'
import './CheckoutPage.css'

const EMPTY_FORM = {
  shippingName: '',
  shippingPhone: '',
  shippingAddress: '',
  shippingCity: '',
  shippingState: '',
  shippingPincode: '',
}

export default function CheckoutPage() {
  const { items, subtotal, itemCount, refresh } = useCart()
  const { user } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()

  const [form, setForm] = useState({ ...EMPTY_FORM, shippingName: user?.name || '' })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Guard against landing here with nothing to check out. Placed after all
  // hooks above so Rules of Hooks are respected even on this early return.
  if (items.length === 0) {
    return <Navigate to="/cart" replace />
  }

  const shippingEstimate = subtotal >= 400000 ? 0 : 4900
  const total = subtotal + shippingEstimate

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      const order = await orderService.createOrder({
        ...form,
        paymentMethod: 'COD',
      })
      showToast('Order placed successfully', { tone: 'success' })
      await refresh()
      navigate(`/orders/${order.id}`, { replace: true })
    } catch (err) {
      setError(err?.message || 'Could not place your order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container checkout-page">
      <h1 className="checkout-page__title">Checkout</h1>

      <div className="checkout-page__grid">
        <form className="checkout-page__form" onSubmit={handleSubmit}>
          <h2 className="checkout-page__section-title">Shipping details</h2>

          {error && (
            <div className="checkout-page__error" role="alert">
              {error}
            </div>
          )}

          <label className="checkout-page__field">
            <span>Full name</span>
            <input
              type="text"
              name="shippingName"
              value={form.shippingName}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>

          <label className="checkout-page__field">
            <span>Phone number</span>
            <input
              type="tel"
              name="shippingPhone"
              value={form.shippingPhone}
              onChange={handleChange}
              required
              autoComplete="tel"
            />
          </label>

          <label className="checkout-page__field">
            <span>Address</span>
            <textarea
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              required
              rows={3}
              autoComplete="street-address"
            />
          </label>

          <div className="checkout-page__field-row">
            <label className="checkout-page__field">
              <span>City</span>
              <input
                type="text"
                name="shippingCity"
                value={form.shippingCity}
                onChange={handleChange}
                required
                autoComplete="address-level2"
              />
            </label>
            <label className="checkout-page__field">
              <span>State</span>
              <input
                type="text"
                name="shippingState"
                value={form.shippingState}
                onChange={handleChange}
                required
                autoComplete="address-level1"
              />
            </label>
            <label className="checkout-page__field">
              <span>Pincode</span>
              <input
                type="text"
                name="shippingPincode"
                value={form.shippingPincode}
                onChange={handleChange}
                required
                autoComplete="postal-code"
                inputMode="numeric"
              />
            </label>
          </div>

          <h2 className="checkout-page__section-title">Payment</h2>
          <div className="checkout-page__payment-option checkout-page__payment-option--active">
            <span>Cash on Delivery</span>
            <span className="checkout-page__payment-note">Pay when your order arrives</span>
          </div>
          <p className="checkout-page__hint">
            Card and UPI payments are coming soon.
          </p>

          <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Placing order…' : `Place order · ${formatPrice(total)}`}
          </Button>
        </form>

        <aside className="checkout-page__summary">
          <h2 className="checkout-page__summary-title">
            Order summary <span>({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          </h2>
          <ul className="checkout-page__summary-list">
            {items.map((item) => (
              <li key={item.id} className="checkout-page__summary-item">
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
                <div>
                  <span className="checkout-page__summary-item-name">{item.name}</span>
                  <span className="checkout-page__summary-item-qty">Qty {item.quantity}</span>
                </div>
                <span className="checkout-page__summary-item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
          <div className="checkout-page__summary-divider" />
          <div className="checkout-page__summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="checkout-page__summary-row">
            <span>Shipping</span>
            <span>{shippingEstimate === 0 ? 'Free' : formatPrice(shippingEstimate)}</span>
          </div>
          <div className="checkout-page__summary-divider" />
          <div className="checkout-page__summary-row checkout-page__summary-row--total">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
