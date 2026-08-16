// Simulates the backend's query/filter/sort/paginate behavior over the
// local mock dataset, returning the EXACT response envelope documented
// in API_CONTRACT.md. This keeps every component contract-shaped from
// day one, so removing this file later (once Spring Boot is live)
// requires no changes anywhere else.

import { products } from '../data/products'
import { categories } from '../data/categories'

const NETWORK_DELAY_MS = 380

function delay(ms = NETWORK_DELAY_MS) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function matchesSearch(product, search) {
  if (!search) return true
  const term = search.toLowerCase()
  return (
    product.name.toLowerCase().includes(term) ||
    product.description.toLowerCase().includes(term) ||
    product.category.name.toLowerCase().includes(term)
  )
}

function applySort(list, sort) {
  const sorted = [...list]
  switch (sort) {
    case 'price_asc':
      return sorted.sort((a, b) => a.price - b.price)
    case 'price_desc':
      return sorted.sort((a, b) => b.price - a.price)
    case 'name_asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    case 'name_desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name))
    case 'rating_desc':
      return sorted.sort((a, b) => b.rating - a.rating)
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id)
    default:
      return sorted
  }
}

/**
 * Mirrors GET /api/products
 * @param {{page?: number, size?: number, category?: string, search?: string,
 *          minPrice?: number, maxPrice?: number, sort?: string}} params
 */
export async function mockGetProducts(params = {}) {
  await delay()

  const {
    page = 0,
    size = 12,
    category,
    search,
    minPrice,
    maxPrice,
    sort,
  } = params

  let filtered = products.filter((p) => {
    if (category && p.category.slug !== category) return false
    if (!matchesSearch(p, search)) return false
    if (minPrice != null && p.price < Number(minPrice)) return false
    if (maxPrice != null && p.price > Number(maxPrice)) return false
    return true
  })

  filtered = applySort(filtered, sort)

  const totalElements = filtered.length
  const totalPages = Math.max(1, Math.ceil(totalElements / size))
  const start = page * size
  const content = filtered.slice(start, start + size)

  return {
    content,
    page: Number(page),
    size: Number(size),
    totalElements,
    totalPages,
  }
}

/** Mirrors GET /api/products/{id} */
export async function mockGetProductById(id) {
  await delay()
  const product = products.find((p) => p.id === Number(id))
  if (!product) {
    throw {
      timestamp: new Date().toISOString(),
      status: 404,
      error: 'NOT_FOUND',
      message: 'Product not found',
      path: `/api/products/${id}`,
    }
  }
  return product
}

/** Mirrors GET /api/products/slug/{slug} */
export async function mockGetProductBySlug(slug) {
  await delay()
  const product = products.find((p) => p.slug === slug)
  if (!product) {
    throw {
      timestamp: new Date().toISOString(),
      status: 404,
      error: 'NOT_FOUND',
      message: 'Product not found',
      path: `/api/products/slug/${slug}`,
    }
  }
  return product
}

/** Mirrors GET /api/categories */
export async function mockGetCategories() {
  await delay(220)
  return categories
}

/** Mirrors GET /api/categories/{id} */
export async function mockGetCategoryById(id) {
  await delay(220)
  const category = categories.find((c) => c.id === Number(id))
  if (!category) {
    throw {
      timestamp: new Date().toISOString(),
      status: 404,
      error: 'NOT_FOUND',
      message: 'Category not found',
      path: `/api/categories/${id}`,
    }
  }
  return category
}

/** Mirrors GET /api/categories/slug/{slug} */
export async function mockGetCategoryBySlug(slug) {
  await delay(220)
  const category = categories.find((c) => c.slug === slug)
  if (!category) {
    throw {
      timestamp: new Date().toISOString(),
      status: 404,
      error: 'NOT_FOUND',
      message: 'Category not found',
      path: `/api/categories/slug/${slug}`,
    }
  }
  return category
}
