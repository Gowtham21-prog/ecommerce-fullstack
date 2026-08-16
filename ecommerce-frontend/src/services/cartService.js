// Public interface for all cart API calls.
//
// Endpoints implemented (see backend CartController):
//   GET    /api/cart
//   POST   /api/cart/items
//   PUT    /api/cart/items/{productId}
//   DELETE /api/cart/items/{productId}
//   DELETE /api/cart
//
// In mock mode (no backend), the cart is kept in localStorage and this
// module fakes the same response shape the real API returns, so
// CartContext never needs to know which mode it's in.

import { apiGet, apiPost, apiPut, apiDelete, USE_MOCK_DATA } from './apiClient'
import { getProductById } from './productService'

const MOCK_CART_KEY = 'fv_mock_cart_v1'

function loadMockCart() {
  try {
    const raw = window.localStorage.getItem(MOCK_CART_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMockCart(rows) {
  try {
    window.localStorage.setItem(MOCK_CART_KEY, JSON.stringify(rows))
  } catch {
    // storage unavailable — fail silently
  }
}

async function toCartResponse(rows) {
  const items = await Promise.all(
    rows.map(async (row) => ({
      id: row.productId,
      product: await getProductById(row.productId),
      quantity: row.quantity,
    }))
  )
  const subtotal = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  return { items, subtotal, itemCount }
}

/** @returns {Promise<{items: Array, subtotal: number, itemCount: number}>} */
export async function getCart() {
  if (USE_MOCK_DATA) return toCartResponse(loadMockCart())
  return apiGet('/cart')
}

/** @param {number} productId @param {number} quantity */
export async function addToCart(productId, quantity = 1) {
  if (USE_MOCK_DATA) {
    const rows = loadMockCart()
    const existing = rows.find((r) => r.productId === productId)
    const product = await getProductById(productId)
    const nextQty = (existing?.quantity || 0) + quantity
    if (product.stock != null && nextQty > product.stock) {
      throw {
        status: 400,
        error: 'BAD_REQUEST',
        message: `Only ${product.stock} unit(s) of "${product.name}" are in stock`,
      }
    }
    if (existing) {
      existing.quantity = nextQty
    } else {
      rows.push({ productId, quantity })
    }
    saveMockCart(rows)
    return toCartResponse(rows)
  }
  return apiPost('/cart/items', { productId, quantity })
}

/** @param {number} productId @param {number} quantity */
export async function updateCartItem(productId, quantity) {
  if (USE_MOCK_DATA) {
    const rows = loadMockCart()
    const row = rows.find((r) => r.productId === productId)
    if (row) row.quantity = quantity
    saveMockCart(rows)
    return toCartResponse(rows)
  }
  return apiPut(`/cart/items/${productId}`, { quantity })
}

/** @param {number} productId */
export async function removeFromCart(productId) {
  if (USE_MOCK_DATA) {
    const rows = loadMockCart().filter((r) => r.productId !== productId)
    saveMockCart(rows)
    return toCartResponse(rows)
  }
  return apiDelete(`/cart/items/${productId}`)
}

export async function clearCart() {
  if (USE_MOCK_DATA) {
    saveMockCart([])
    return { items: [], subtotal: 0, itemCount: 0 }
  }
  return apiDelete('/cart')
}
