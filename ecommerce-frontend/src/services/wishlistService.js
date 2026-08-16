// Public interface for all wishlist API calls.
//
// Endpoints implemented (see backend WishlistController):
//   GET    /api/wishlist
//   POST   /api/wishlist/{productId}
//   DELETE /api/wishlist/{productId}

import { apiGet, apiPost, apiDelete, USE_MOCK_DATA } from './apiClient'
import { getProductById } from './productService'

const MOCK_WISHLIST_KEY = 'fv_mock_wishlist_v1'

function loadMockIds() {
  try {
    const raw = window.localStorage.getItem(MOCK_WISHLIST_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMockIds(ids) {
  try {
    window.localStorage.setItem(MOCK_WISHLIST_KEY, JSON.stringify(ids))
  } catch {
    // storage unavailable — fail silently
  }
}

async function toWishlistResponse(ids) {
  return Promise.all(
    ids.map(async (productId) => ({
      id: productId,
      product: await getProductById(productId),
    }))
  )
}

/** @returns {Promise<Array<{id: number, product: object}>>} */
export async function getWishlist() {
  if (USE_MOCK_DATA) return toWishlistResponse(loadMockIds())
  return apiGet('/wishlist')
}

/** @param {number} productId */
export async function addToWishlist(productId) {
  if (USE_MOCK_DATA) {
    const ids = loadMockIds()
    if (!ids.includes(productId)) ids.push(productId)
    saveMockIds(ids)
    return toWishlistResponse(ids)
  }
  return apiPost(`/wishlist/${productId}`)
}

/** @param {number} productId */
export async function removeFromWishlist(productId) {
  if (USE_MOCK_DATA) {
    const ids = loadMockIds().filter((id) => id !== productId)
    saveMockIds(ids)
    return toWishlistResponse(ids)
  }
  return apiDelete(`/wishlist/${productId}`)
}
