import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../../components/common/Icon'
import Button from '../../components/common/Button'
import EmptyState from '../../components/common/EmptyState'
import { useToast } from '../../components/common/Toast'
import * as sellerService from '../../services/sellerService'
import { formatPrice } from '../../utils/formatters'
import './SellerProductsPage.css'

export default function SellerProductsPage() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stockDrafts, setStockDrafts] = useState({})
  const { showToast } = useToast()

  function loadProducts() {
    setIsLoading(true)
    return sellerService
      .getMyProducts({ page: 0, size: 100 })
      .then((res) => setProducts(res.content || []))
      .catch((err) => showToast(err?.message || 'Could not load your products', { tone: 'error' }))
      .finally(() => setIsLoading(false))
  }

  useEffect(() => {
    loadProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleStockSave(product) {
    const draft = stockDrafts[product.id]
    const nextStock = Number(draft)
    if (draft === undefined || Number.isNaN(nextStock) || nextStock < 0) {
      showToast('Enter a valid stock quantity', { tone: 'error' })
      return
    }
    try {
      const updated = await sellerService.updateStock(product.id, nextStock)
      setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)))
      setStockDrafts((prev) => {
        const next = { ...prev }
        delete next[product.id]
        return next
      })
      showToast('Stock updated', { tone: 'success' })
    } catch (err) {
      showToast(err?.message || 'Could not update stock', { tone: 'error' })
    }
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return
    try {
      await sellerService.deleteProduct(product.id)
      setProducts((prev) => prev.filter((p) => p.id !== product.id))
      showToast('Product deleted')
    } catch (err) {
      showToast(err?.message || 'Could not delete product', { tone: 'error' })
    }
  }

  return (
    <div className="seller-products">
      <div className="seller-products__header">
        <h1 className="seller-products__title">Your products</h1>
        <Button as={Link} to="/seller/products/new" variant="primary">
          + Add product
        </Button>
      </div>

      {isLoading ? (
        <p>Loading your products…</p>
      ) : products.length === 0 ? (
        <EmptyState
          icon={<Icon name="bag" size={40} />}
          title="No products yet"
          description="Add your first product to start selling."
          actionLabel="Add product"
          onAction={() => (window.location.href = '/seller/products/new')}
        />
      ) : (
        <table className="seller-products__table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Price</th>
              <th>Stock</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <div className="seller-products__cell-product">
                    <img src={product.imageUrl} alt="" loading="lazy" />
                    <span>{product.name}</span>
                  </div>
                </td>
                <td>{formatPrice(product.price)}</td>
                <td>
                  <div className="seller-products__stock-editor">
                    <input
                      type="number"
                      min="0"
                      value={stockDrafts[product.id] ?? product.stock}
                      onChange={(e) =>
                        setStockDrafts((prev) => ({ ...prev, [product.id]: e.target.value }))
                      }
                    />
                    {stockDrafts[product.id] !== undefined &&
                      Number(stockDrafts[product.id]) !== product.stock && (
                        <button
                          className="seller-products__stock-save"
                          onClick={() => handleStockSave(product)}
                          aria-label="Save stock"
                        >
                          <Icon name="check" size={14} />
                        </button>
                      )}
                  </div>
                </td>
                <td>
                  <div className="seller-products__row-actions">
                    <Link to={`/seller/products/${product.id}/edit`} aria-label="Edit product">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(product)} aria-label="Delete product">
                      <Icon name="trash" size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
