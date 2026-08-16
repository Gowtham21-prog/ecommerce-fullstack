import { Link } from 'react-router-dom'
import ProductGrid from '../product/ProductGrid'
import Button from '../common/Button'
import Icon from '../common/Icon'
import './FeaturedProducts.css'

export default function FeaturedProducts({ title, eyebrow, products, isLoading }) {
  return (
    <section className="featured-products">
      <div className="container">
        <div className="featured-products__header">
          <div className="section-heading">
            <span className="section-heading__eyebrow">{eyebrow}</span>
            <h2 className="section-heading__title">{title}</h2>
          </div>
          <Button as={Link} to="/shop" variant="ghost" icon={<Icon name="arrowUpRight" />}>
            View all
          </Button>
        </div>
        <ProductGrid products={products} isLoading={isLoading} skeletonCount={4} />
      </div>
    </section>
  )
}
