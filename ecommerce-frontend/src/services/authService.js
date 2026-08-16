// Public interface for all authentication API calls.
//
// Components should ONLY import from here — never call apiPost/apiGet
// for auth directly. Mirrors the structure of productService.js.
//
// Endpoints implemented (see backend AuthController):
//   POST /api/auth/register
//   POST /api/auth/login
//   GET  /api/auth/me

import { apiPost, apiGet } from './apiClient'

/**
 * Registers a new user.
 * @param {{name: string, email: string, password: string, role?: 'CUSTOMER'|'SELLER'}} payload
 * @returns {Promise<{token: string, userId: number, name: string, email: string, role: string}>}
 */
export function register(payload) {
  return apiPost('/auth/register', payload)
}

/**
 * Logs in an existing user.
 * @param {{email: string, password: string}} payload
 * @returns {Promise<{token: string, userId: number, name: string, email: string, role: string}>}
 */
export function login(payload) {
  return apiPost('/auth/login', payload)
}

/**
 * Fetches the currently authenticated user using the stored token.
 * Used on app load to validate/rehydrate a session.
 * @returns {Promise<{id: number, name: string, email: string, role: string}>}
 */
export function getCurrentUser() {
  return apiGet('/auth/me')
}
