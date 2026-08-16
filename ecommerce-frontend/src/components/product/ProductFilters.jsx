import Icon from '../common/Icon'
import './ProductFilters.css'

const PRICE_RANGES = [
  { label: 'Under ₹100', min: undefined, max: 10000 },
  { label: '₹100 – ₹300', min: 10000, max: 30000 },
  { label: '₹300 – ₹500', min: 30000, max: 50000 },
  { label: 'Over ₹500', min: 50000, max: undefined },
]

export default function ProductFilters({
  categories,
  activeCategory,
  onCategoryChange,
  activePriceRange,
  onPriceRangeChange,
  onClearAll,
}) {
  const hasActiveFilters = Boolean(activeCategory) || Boolean(activePriceRange)

  return (
    <div className="product-filters">
      <div className="product-filters__header">
        <h3 className="product-filters__title">
          <Icon name="filter" size={16} />
          Filter
        </h3>
        {hasActiveFilters && (
          <button className="product-filters__clear" onClick={onClearAll}>
            Clear all
          </button>
        )}
      </div>

      <div className="product-filters__group">
        <h4 className="product-filters__group-title">Category</h4>
        <ul className="product-filters__list">
          <li>
            <button
              className={`product-filters__option ${!activeCategory ? 'product-filters__option--active' : ''}`}
              onClick={() => onCategoryChange(null)}
            >
              All products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat.id}>
              <button
                className={`product-filters__option ${
                  activeCategory === cat.slug ? 'product-filters__option--active' : ''
                }`}
                onClick={() => onCategoryChange(cat.slug)}
              >
                {cat.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="product-filters__group">
        <h4 className="product-filters__group-title">Price</h4>
        <ul className="product-filters__list">
          {PRICE_RANGES.map((range) => {
            const isActive =
              activePriceRange?.min === range.min && activePriceRange?.max === range.max
            return (
              <li key={range.label}>
                <button
                  className={`product-filters__option ${
                    isActive ? 'product-filters__option--active' : ''
                  }`}
                  onClick={() => onPriceRangeChange(isActive ? null : range)}
                >
                  {range.label}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
