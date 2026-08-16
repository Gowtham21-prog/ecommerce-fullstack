// Public interface for seller-only API calls (product & order management).
//
// Endpoints implemented (see backend SellerController):
//   GET    /api/seller/products
//   POST   /api/seller/products
//   PUT    /api/seller/products/{id}
//   DELETE /api/seller/products/{id}
//   PATCH  /api/seller/products/{id}/stock
//   GET    /api/seller/orders
//   PATCH  /api/seller/orders/{orderId}/status
//
// Note: unlike the other services, this one does NOT have a mock-mode
// fallback — seller tools always call the real backend. Set
// VITE_USE_MOCK_DATA=false and run the Spring Boot API to use the
// seller dashboard.

import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from './apiClient'

/** @param {{page?: number, size?: number}} params */
export function getMyProducts(params = {}) {
  const search = new URLSearchParams()
  if (params.page != null) search.set('page', params.page)
  if (params.size != null) search.set('size', params.size)
  const qs = search.toString()
  return apiGet(`/seller/products${qs ? `?${qs}` : ''}`)
}

/**
 * @param {{name, description?, price, originalPrice?, categoryId?, imageUrl?,
 *          images?, stock, featured?, bestseller?}} payload
 */
export function createProduct(payload) {
  return apiPost('/seller/products', payload)
}

/** @param {number} id */
export function updateProduct(id, payload) {
  return apiPut(`/seller/products/${id}`, payload)
}

/** @param {number} id */
export function deleteProduct(id) {
  return apiDelete(`/seller/products/${id}`)
}

/** @param {number} id @param {number} stock */
export function updateStock(id, stock) {
  return apiPatch(`/seller/products/${id}/stock`, { stock })
}

/** @param {{page?: number, size?: number}} params */
export function getMyOrderItems(params = {}) {
  const search = new URLSearchParams()
  if (params.page != null) search.set('page', params.page)
  if (params.size != null) search.set('size', params.size)
  const qs = search.toString()
  return apiGet(`/seller/orders${qs ? `?${qs}` : ''}`)
}

/** @param {number} orderId @param {string} status */
export function updateOrderStatus(orderId, status) {
  return apiPatch(`/seller/orders/${orderId}/status`, { status })
}
