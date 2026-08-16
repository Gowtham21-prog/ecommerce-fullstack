import { Link } from 'react-router-dom'
import Icon from '../common/Icon'
import Skeleton from '../common/Skeleton'
import './CategoryGrid.css'

export default function CategoryGrid({ categories, isLoading }) {
  return (
    <section className="category-grid-section">
      <div className="container">
        <div className="section-heading">
          <span className="section-heading__eyebrow">Browse</span>
          <h2 className="section-heading__title">Shop by category</h2>
        </div>

        <div className="category-grid">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} variant="block" className="category-grid__skeleton" />
              ))
            : categories.map((cat, i) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="category-card animate-fade-up"
                  style={{ animationDelay: `${i * 70}ms` }}
                >
                  <img src={cat.imageUrl} alt="" loading="lazy" className="category-card__image" />
                  <div className="category-card__overlay" />
                  <div className="category-card__content">
                    <span className="category-card__name">{cat.name}</span>
                    <span className="category-card__arrow">
                      <Icon name="arrowUpRight" size={16} />
                    </span>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}
