import { useEffect, useState } from 'react'
import EmptyState from '../../components/common/EmptyState'
import Icon from '../../components/common/Icon'
import { useToast } from '../../components/common/Toast'
import * as sellerService from '../../services/sellerService'
import { formatPrice } from '../../utils/formatters'
import './SellerOrdersPage.css'

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function SellerOrdersPage() {
  const [orderItems, setOrderItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState(null)
  const { showToast } = useToast()

  useEffect(() => {
    let cancelled = false
    sellerService
      .getMyOrderItems({ page: 0, size: 100 })
      .then((res) => !cancelled && setOrderItems(res.content || []))
      .catch((err) => showToast(err?.message || 'Could not load your orders', { tone: 'error' }))
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleStatusChange(orderId, status) {
    setUpdatingId(orderId)
    try {
      await sellerService.updateOrderStatus(orderId, status)
      showToast('Order status updated', { tone: 'success' })
    } catch (err) {
      showToast(err?.message || 'Could not update order status', { tone: 'error' })
    } finally {
      setUpdatingId(null)
    }
  }

  if (isLoading) {
    return <p>Loading your orders…</p>
  }

  if (orderItems.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="bag" size={40} />}
        title="No orders yet"
        description="Orders containing your products will show up here."
      />
    )
  }

  return (
    <div className="seller-orders">
      <h1 className="seller-orders__title">Orders</h1>

      <table className="seller-orders__table">
        <thead>
          <tr>
            <th>Order</th>
            <th>Item</th>
            <th>Qty</th>
            <th>Amount</th>
            <th>Update status</th>
          </tr>
        </thead>
        <tbody>
          {orderItems.map((item) => (
            <tr key={item.id}>
              <td>#{item.orderId ?? '—'}</td>
              <td>
                <div className="seller-orders__cell-product">
                  <img src={item.productImage} alt="" loading="lazy" />
                  <span>{item.productName}</span>
                </div>
              </td>
              <td>{item.quantity}</td>
              <td>{formatPrice(item.price * item.quantity)}</td>
              <td>
                {item.orderId ? (
                  <select
                    defaultValue=""
                    disabled={updatingId === item.orderId}
                    onChange={(e) => {
                      if (e.target.value) handleStatusChange(item.orderId, e.target.value)
                    }}
                  >
                    <option value="" disabled>
                      Set status…
                    </option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span className="seller-orders__no-id">—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
