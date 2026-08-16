// Public interface for all category data access. See productService.js
// for the same mock/real switching pattern.
//
// Endpoints implemented (see API_CONTRACT.md):
//   GET /api/categories
//   GET /api/categories/{id}
//   GET /api/categories/slug/{slug}

import { apiGet, USE_MOCK_DATA } from './apiClient'
import {
  mockGetCategories,
  mockGetCategoryById,
  mockGetCategoryBySlug,
} from './mockAdapter'

/** @returns {Promise<Array<{id:number,name:string,slug:string,imageUrl:string}>>} */
export function getCategories() {
  if (USE_MOCK_DATA) return mockGetCategories()
  return apiGet('/categories')
}

/** @param {number|string} id */
export function getCategoryById(id) {
  if (USE_MOCK_DATA) return mockGetCategoryById(id)
  return apiGet(`/categories/${id}`)
}

/** @param {string} slug */
export function getCategoryBySlug(slug) {
  if (USE_MOCK_DATA) return mockGetCategoryBySlug(slug)
  return apiGet(`/categories/slug/${slug}`)
}
