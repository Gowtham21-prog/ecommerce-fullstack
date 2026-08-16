import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductGrid from '../components/product/ProductGrid'
import ProductFilters from '../components/product/ProductFilters'
import SortDropdown from '../components/product/SortDropdown'
import Pagination from '../components/product/Pagination'
import Icon from '../components/common/Icon'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'
import './ShopPage.css'

const PAGE_SIZE = 12

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  const { categories } = useCategories()

  const page = Number(searchParams.get('page') || 0)
  const category = searchParams.get('category') || undefined
  const search = searchParams.get('search') || undefined
  const sort = searchParams.get('sort') || undefined
  const minPrice = searchParams.get('minPrice') || undefined
  const maxPrice = searchParams.get('maxPrice') || undefined

  const activePriceRange =
    minPrice || maxPrice
      ? { min: minPrice ? Number(minPrice) : undefined, max: maxPrice ? Number(maxPrice) : undefined }
      : null

  const params = useMemo(
    () => ({ page, size: PAGE_SIZE, category, search, sort, minPrice, maxPrice }),
    [page, category, search, sort, minPrice, maxPrice]
  )

  const { data, isLoading } = useProducts(params)

  function updateParams(updates) {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    setSearchParams(next)
  }

  function handleCategoryChange(slug) {
    updateParams({ category: slug, page: 0 })
  }

  function handlePriceRangeChange(range) {
    updateParams({
      minPrice: range?.min ?? null,
      maxPrice: range?.max ?? null,
      page: 0,
    })
  }

  function handleSortChange(value) {
    updateParams({ sort: value || null, page: 0 })
  }

  function handlePageChange(newPage) {
    updateParams({ page: newPage })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleClearAll() {
    setSearchParams({})
  }

  const activeCategoryName = categories.find((c) => c.slug === category)?.name

  return (
    <div className="shop-page">
      <div className="shop-page__header">
        <div className="container">
          <span className="section-heading__eyebrow">
            {search ? 'Search results' : 'Shop'}
          </span>
          <h1 className="shop-page__title">
            {search ? `“${search}”` : activeCategoryName || 'All products'}
          </h1>
        </div>
      </div>

      <div className="container shop-page__body">
        <aside className={`shop-page__sidebar ${isMobileFiltersOpen ? 'shop-page__sidebar--open' : ''}`}>
          <ProductFilters
            categories={categories}
            activeCategory={category}
            onCategoryChange={(slug) => {
              handleCategoryChange(slug)
              setIsMobileFiltersOpen(false)
            }}
            activePriceRange={activePriceRange}
            onPriceRangeChange={(range) => {
              handlePriceRangeChange(range)
              setIsMobileFiltersOpen(false)
            }}
            onClearAll={handleClearAll}
          />
        </aside>

        <div className="shop-page__main">
          <div className="shop-page__toolbar">
            <button
              className="shop-page__mobile-filter-btn"
              onClick={() => setIsMobileFiltersOpen(true)}
            >
              <Icon name="filter" size={16} />
              Filter
            </button>
            <span className="shop-page__result-count">
              {isLoading ? 'Loading…' : `${data?.totalElements ?? 0} products`}
            </span>
            <SortDropdown value={sort || ''} onChange={handleSortChange} />
          </div>

          <ProductGrid
            products={data?.content}
            isLoading={isLoading}
            emptyTitle="No products match those filters"
            emptyDescription="Try a different category, price range, or clear all filters to see everything."
          />

          {!isLoading && data && (
            <Pagination
              currentPage={data.page}
              totalPages={data.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>

      {isMobileFiltersOpen && (
        <div
          className="shop-page__sidebar-backdrop"
          onClick={() => setIsMobileFiltersOpen(false)}
        />
      )}
    </div>
  )
}
