import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as sellerService from '../../services/sellerService'
import { formatPrice } from '../../utils/formatters'
import './SellerDashboardPage.css'

export default function SellerDashboardPage() {
  const [products, setProducts] = useState([])
  const [orderItems, setOrderItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      sellerService.getMyProducts({ page: 0, size: 100 }),
      sellerService.getMyOrderItems({ page: 0, size: 100 }),
    ])
      .then(([productsRes, ordersRes]) => {
        if (cancelled) return
        setProducts(productsRes.content || [])
        setOrderItems(ordersRes.content || [])
      })
      .catch(() => {})
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
  }, [])

  const lowStock = products.filter((p) => p.stock <= 5).length
  const revenue = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <div className="seller-dashboard">
      <h1 className="seller-dashboard__title">Seller dashboard</h1>

      {isLoading ? (
        <p>Loading your store overview…</p>
      ) : (
        <>
          <div className="seller-dashboard__stats">
            <div className="seller-dashboard__stat">
              <span className="seller-dashboard__stat-value">{products.length}</span>
              <span className="seller-dashboard__stat-label">Products listed</span>
            </div>
            <div className="seller-dashboard__stat">
              <span className="seller-dashboard__stat-value">{orderItems.length}</span>
              <span className="seller-dashboard__stat-label">Items ordered</span>
            </div>
            <div className="seller-dashboard__stat">
              <span className="seller-dashboard__stat-value">{formatPrice(revenue)}</span>
              <span className="seller-dashboard__stat-label">Gross revenue</span>
            </div>
            <div className="seller-dashboard__stat seller-dashboard__stat--warn">
              <span className="seller-dashboard__stat-value">{lowStock}</span>
              <span className="seller-dashboard__stat-label">Low stock (≤5)</span>
            </div>
          </div>

          <div className="seller-dashboard__actions">
            <Link to="/seller/products/new" className="seller-dashboard__action">
              + Add a new product
            </Link>
            <Link to="/seller/orders" className="seller-dashboard__action">
              View recent orders
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
