import { useMemo } from 'react'
import Hero from '../components/home/Hero'
import CategoryGrid from '../components/home/CategoryGrid'
import FeaturedProducts from '../components/home/FeaturedProducts'
import { ValueProps, CTABanner } from '../components/home/PromoSections'
import { useCategories } from '../hooks/useCategories'
import { useProducts } from '../hooks/useProducts'

export default function HomePage() {
  const { categories, isLoading: categoriesLoading } = useCategories()

  const featuredParams = useMemo(() => ({ page: 0, size: 4, sort: 'newest' }), [])
  const { data: featuredData, isLoading: featuredLoading } = useProducts(featuredParams)

  const bestsellerParams = useMemo(() => ({ page: 0, size: 4, sort: 'rating_desc' }), [])
  const { data: bestsellerData, isLoading: bestsellerLoading } = useProducts(bestsellerParams)

  return (
    <>
      <Hero />
      <ValueProps />
      <CategoryGrid categories={categories} isLoading={categoriesLoading} />
      <FeaturedProducts
        eyebrow="New in"
        title="Just arrived"
        products={featuredData?.content}
        isLoading={featuredLoading}
      />
      <CTABanner />
      <FeaturedProducts
        eyebrow="Loved by many"
        title="Customer favourites"
        products={bestsellerData?.content}
        isLoading={bestsellerLoading}
      />
    </>
  )
}
