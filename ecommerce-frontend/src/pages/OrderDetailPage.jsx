import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/common/Icon'
import Badge from '../components/common/Badge'
import EmptyState from '../components/common/EmptyState'
import * as orderService from '../services/orderService'
import { formatPrice } from '../utils/formatters'
import './OrdersPage.css'
import './OrderDetailPage.css'

const STATUS_TONE = {
  PENDING: 'outline',
  CONFIRMED: 'paper',
  SHIPPED: 'clay',
  DELIVERED: 'moss',
  CANCELLED: 'ink',
}

const STATUS_STEPS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  } catch {
    return ''
  }
}

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    orderService
      .getOrderById(id)
      .then((data) => !cancelled && setOrder(data))
      .catch((err) => !cancelled && setError(err?.message || 'Could not load this order'))
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [id])

  if (isLoading) {
    return <div className="container orders-page"><p>Loading order…</p></div>
  }

  if (error || !order) {
    return (
      <div className="container orders-page">
        <EmptyState
          icon={<Icon name="bag" size={40} />}
          title="Order not found"
          description={error || "We couldn't find that order."}
          actionLabel="Back to orders"
          onAction={() => (window.location.href = '/orders')}
        />
      </div>
    )
  }

  const stepIndex = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div className="container order-detail-page">
      <Link to="/orders" className="order-detail-page__back">
        <Icon name="arrowUpRight" size={14} style={{ transform: 'rotate(225deg)' }} />
        Back to orders
      </Link>

      <div className="order-detail-page__header">
        <div>
          <h1 className="order-detail-page__title">Order #{order.id}</h1>
          <p className="order-detail-page__date">Placed {formatDate(order.createdAt)}</p>
        </div>
        <Badge tone={STATUS_TONE[order.status] || 'outline'}>{order.status}</Badge>
      </div>

      {!isCancelled && (
        <ol className="order-detail-page__tracker">
          {STATUS_STEPS.map((step, i) => (
            <li
              key={step}
              className={`order-detail-page__tracker-step ${
                i <= stepIndex ? 'order-detail-page__tracker-step--done' : ''
              }`}
            >
              <span className="order-detail-page__tracker-dot" />
              <span className="order-detail-page__tracker-label">{step}</span>
            </li>
          ))}
        </ol>
      )}

      <div className="order-detail-page__grid">
        <div>
          <h2 className="order-detail-page__section-title">Items</h2>
          <ul className="order-detail-page__items">
            {order.items.map((item) => (
              <li key={item.id} className="order-detail-page__item">
                <img src={item.productImage} alt={item.productName} loading="lazy" />
                <div className="order-detail-page__item-body">
                  <span className="order-detail-page__item-name">{item.productName}</span>
                  <span className="order-detail-page__item-qty">Qty {item.quantity}</span>
                </div>
                <span className="order-detail-page__item-price">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <aside className="order-detail-page__summary">
          <h2 className="order-detail-page__section-title">Shipping to</h2>
          <p className="order-detail-page__address">
            {order.shippingName}
            <br />
            {order.shippingAddress}
            <br />
            {order.shippingCity}, {order.shippingState} {order.shippingPincode}
            <br />
            {order.shippingPhone}
          </p>

          <div className="order-detail-page__summary-divider" />

          <div className="order-detail-page__summary-row">
            <span>Payment method</span>
            <span>{order.paymentMethod}</span>
          </div>
          <div className="order-detail-page__summary-row order-detail-page__summary-row--total">
            <span>Total</span>
            <span>{formatPrice(order.totalAmount)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
