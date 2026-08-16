// Public interface for all product data access.
//
// Components and hooks should ONLY import from here — never from
// data/products.js or mockAdapter.js directly. That keeps the mock/real
// switch (USE_MOCK_DATA) entirely invisible to the rest of the app.
//
// Endpoints implemented (see API_CONTRACT.md):
//   GET /api/products
//   GET /api/products/{id}
//   GET /api/products/slug/{slug}

import { apiGet, buildQuery, USE_MOCK_DATA } from './apiClient'
import {
  mockGetProducts,
  mockGetProductById,
  mockGetProductBySlug,
} from './mockAdapter'

/**
 * Fetches a paginated, filtered, sorted list of products.
 * @param {{page?: number, size?: number, category?: string, search?: string,
 *          minPrice?: number, maxPrice?: number, sort?: string}} params
 * @returns {Promise<{content: Array, page: number, size: number,
 *          totalElements: number, totalPages: number}>}
 */
export function getProducts(params = {}) {
  if (USE_MOCK_DATA) return mockGetProducts(params)
  return apiGet(`/products${buildQuery(params)}`)
}

/** @param {number|string} id */
export function getProductById(id) {
  if (USE_MOCK_DATA) return mockGetProductById(id)
  return apiGet(`/products/${id}`)
}

/** @param {string} slug */
export function getProductBySlug(slug) {
  if (USE_MOCK_DATA) return mockGetProductBySlug(slug)
  return apiGet(`/products/slug/${slug}`)
}
