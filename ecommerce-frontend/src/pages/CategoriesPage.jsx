import { useCategories } from '../hooks/useCategories'
import CategoryGrid from '../components/home/CategoryGrid'
import './CategoriesPage.css'

export default function CategoriesPage() {
  const { categories, isLoading } = useCategories()

  return (
    <div className="categories-page">
      <div className="container categories-page__header">
        <span className="section-heading__eyebrow">Browse</span>
        <h1 className="categories-page__title">All categories</h1>
        <p className="categories-page__description">
          Six departments, each built around a single question: will this still
          be worth using in ten years?
        </p>
      </div>
      <CategoryGrid categories={categories} isLoading={isLoading} />
    </div>
  )
}
