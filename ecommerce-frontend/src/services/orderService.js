// Public interface for all order API calls.
//
// Endpoints implemented (see backend OrderController):
//   POST /api/orders          — checkout (builds order from the server-side cart)
//   GET  /api/orders          — the current user's order history
//   GET  /api/orders/{id}     — a single order

import { apiGet, apiPost, USE_MOCK_DATA } from './apiClient'
import { getCart, clearCart } from './cartService'

const MOCK_ORDERS_KEY = 'fv_mock_orders_v1'

function loadMockOrders() {
  try {
    const raw = window.localStorage.getItem(MOCK_ORDERS_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveMockOrders(orders) {
  try {
    window.localStorage.setItem(MOCK_ORDERS_KEY, JSON.stringify(orders))
  } catch {
    // storage unavailable — fail silently
  }
}

/**
 * @param {{shippingName, shippingPhone, shippingAddress, shippingCity,
 *          shippingState, shippingPincode, paymentMethod?}} payload
 */
export async function createOrder(payload) {
  if (USE_MOCK_DATA) {
    const cart = await getCart()
    if (cart.items.length === 0) {
      throw { status: 400, error: 'BAD_REQUEST', message: 'Your cart is empty' }
    }
    const order = {
      id: Date.now(),
      items: cart.items.map((i) => ({
        id: i.product.id,
        productId: i.product.id,
        productName: i.product.name,
        productImage: i.product.imageUrl,
        price: i.product.price,
        quantity: i.quantity,
      })),
      totalAmount: cart.subtotal,
      status: 'PENDING',
      ...payload,
      paymentMethod: payload.paymentMethod || 'COD',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const orders = loadMockOrders()
    orders.unshift(order)
    saveMockOrders(orders)
    await clearCart()
    return order
  }
  return apiPost('/orders', payload)
}

/** @param {{page?: number, size?: number}} params */
export async function getMyOrders(params = {}) {
  if (USE_MOCK_DATA) {
    const { page = 0, size = 10 } = params
    const all = loadMockOrders()
    const start = page * size
    const content = all.slice(start, start + size)
    return {
      content,
      page,
      size,
      totalElements: all.length,
      totalPages: Math.max(1, Math.ceil(all.length / size)),
    }
  }
  const search = new URLSearchParams()
  if (params.page != null) search.set('page', params.page)
  if (params.size != null) search.set('size', params.size)
  const qs = search.toString()
  return apiGet(`/orders${qs ? `?${qs}` : ''}`)
}

/** @param {number} id */
export async function getOrderById(id) {
  if (USE_MOCK_DATA) {
    const order = loadMockOrders().find((o) => o.id === Number(id))
    if (!order) {
      throw { status: 404, error: 'NOT_FOUND', message: 'Order not found' }
    }
    return order
  }
  return apiGet(`/orders/${id}`)
}
