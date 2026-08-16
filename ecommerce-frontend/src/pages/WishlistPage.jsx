import { useEffect, useState } from 'react'
import ProductGrid from '../components/product/ProductGrid'
import { useToast } from '../components/common/Toast'
import * as wishlistService from '../services/wishlistService'
import './WishlistPage.css'

export default function WishlistPage() {
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    wishlistService
      .getWishlist()
      .then((data) => !cancelled && setItems(data))
      .catch((err) => {
        if (!cancelled) showToast(err?.message || 'Could not load your wishlist', { tone: 'error' })
      })
      .finally(() => !cancelled && setIsLoading(false))
    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const products = items.map((item) => item.product)

  return (
    <div className="container wishlist-page">
      <h1 className="wishlist-page__title">
        Your wishlist {items.length > 0 && <span>({items.length})</span>}
      </h1>
      <ProductGrid
        products={products}
        isLoading={isLoading}
        emptyTitle="Your wishlist is empty"
        emptyDescription="Tap the heart icon on any product to save it here for later."
      />
    </div>
  )
}
