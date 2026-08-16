import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/common/Icon'
import EmptyState from '../components/common/EmptyState'
import Badge from '../components/common/Badge'
import * as orderService from '../services/orderService'
import { formatPrice } from '../utils/formatters'
import './OrdersPage.css'

const STATUS_TONE = {
  PENDING: 'outline',
  CONFIRMED: 'paper',
  SHIPPED: 'clay',
  DELIVERED: 'moss',
  CANCELLED: 'ink',
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

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    orderService
      .getMyOrders({ page: 0, size: 20 })
      .then((res) => {
        if (!cancelled) setOrders(res.content || [])
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || 'Could not load your orders')
      })
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  if (isLoading) {
    return <div className="container orders-page"><p>Loading your orders…</p></div>
  }

  if (error) {
    return (
      <div className="container orders-page">
        <EmptyState
          icon={<Icon name="bag" size={40} />}
          title="Could not load orders"
          description={error}
        />
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="container orders-page">
        <EmptyState
          icon={<Icon name="bag" size={40} />}
          title="No orders yet"
          description="Once you place an order, you'll be able to track it here."
          actionLabel="Start shopping"
          onAction={() => (window.location.href = '/shop')}
        />
      </div>
    )
  }

  return (
    <div className="container orders-page">
      <h1 className="orders-page__title">Your orders</h1>

      <ul className="orders-page__list">
        {orders.map((order) => (
          <li key={order.id} className="orders-page__item">
            <Link to={`/orders/${order.id}`} className="orders-page__item-link">
              <div className="orders-page__item-thumbs">
                {order.items.slice(0, 3).map((item) => (
                  <img
                    key={item.id}
                    src={item.productImage}
                    alt=""
                    loading="lazy"
                  />
                ))}
                {order.items.length > 3 && (
                  <span className="orders-page__item-more">+{order.items.length - 3}</span>
                )}
              </div>
              <div className="orders-page__item-body">
                <div className="orders-page__item-top">
                  <span className="orders-page__item-id">Order #{order.id}</span>
                  <Badge tone={STATUS_TONE[order.status] || 'outline'}>{order.status}</Badge>
                </div>
                <span className="orders-page__item-date">{formatDate(order.createdAt)}</span>
                <span className="orders-page__item-count">
                  {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <span className="orders-page__item-total">{formatPrice(order.totalAmount)}</span>
              <Icon name="arrowUpRight" size={18} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
