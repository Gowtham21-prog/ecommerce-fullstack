import ProductCard from './ProductCard'
import { ProductCardSkeleton } from '../common/Skeleton'
import EmptyState from '../common/EmptyState'
import Icon from '../common/Icon'
import './ProductGrid.css'

export default function ProductGrid({
  products,
  isLoading,
  skeletonCount = 8,
  emptyTitle = 'No products found',
  emptyDescription = 'Try adjusting your filters or search term.',
}) {
  if (isLoading) {
    return (
      <div className="product-grid">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon={<Icon name="bag" size={40} />}
        title={emptyTitle}
        description={emptyDescription}
      />
    )
  }

  return (
    <div className="product-grid">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  )
}
