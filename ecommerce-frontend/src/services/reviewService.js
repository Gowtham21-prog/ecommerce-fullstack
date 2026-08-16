// Public interface for all product review API calls.
//
// Endpoints implemented (see backend ReviewController):
//   GET    /api/products/{productId}/reviews   (public)
//   POST   /api/products/{productId}/reviews   (auth — create/update own review)
//   DELETE /api/reviews/{reviewId}              (auth — delete own review)

import { apiGet, apiPost, apiDelete, USE_MOCK_DATA } from './apiClient'

const MOCK_REVIEWS_KEY = 'fv_mock_reviews_v1'

function loadMockReviews() {
  try {
    const raw = window.localStorage.getItem(MOCK_REVIEWS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMockReviews(reviews) {
  try {
    window.localStorage.setItem(MOCK_REVIEWS_KEY, JSON.stringify(reviews))
  } catch {
    // storage unavailable — fail silently
  }
}

/** @param {number} productId */
export async function getReviews(productId) {
  if (USE_MOCK_DATA) {
    return loadMockReviews()
      .filter((r) => r.productId === Number(productId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return apiGet(`/products/${productId}/reviews`)
}

/**
 * Creates or updates the current user's review for a product.
 * @param {number} productId
 * @param {{rating: number, comment?: string}} payload
 * @param {{id: number, name: string}} [mockUser] required in mock mode
 */
export async function submitReview(productId, payload, mockUser) {
  if (USE_MOCK_DATA) {
    const reviews = loadMockReviews()
    const existingIdx = reviews.findIndex(
      (r) => r.productId === Number(productId) && r.userId === mockUser?.id
    )
    const review = {
      id: existingIdx >= 0 ? reviews[existingIdx].id : Date.now(),
      userId: mockUser?.id,
      userName: mockUser?.name || 'You',
      productId: Number(productId),
      rating: payload.rating,
      comment: payload.comment || '',
      createdAt: new Date().toISOString(),
    }
    if (existingIdx >= 0) {
      reviews[existingIdx] = review
    } else {
      reviews.push(review)
    }
    saveMockReviews(reviews)
    return review
  }
  return apiPost(`/products/${productId}/reviews`, payload)
}

/** @param {number} reviewId */
export async function deleteReview(reviewId) {
  if (USE_MOCK_DATA) {
    const reviews = loadMockReviews().filter((r) => r.id !== reviewId)
    saveMockReviews(reviews)
    return null
  }
  return apiDelete(`/reviews/${reviewId}`)
}
