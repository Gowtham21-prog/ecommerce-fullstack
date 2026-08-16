// Thin fetch wrapper shared by every service module.
//
// This is the ONLY place that knows how to talk HTTP to the backend.
// Once Spring Boot is live, set VITE_API_BASE_URL and VITE_USE_MOCK_DATA=false
// in .env — no other file needs to change.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

export const USE_MOCK_DATA =
  (import.meta.env.VITE_USE_MOCK_DATA ?? 'true') === 'true'

const TOKEN_STORAGE_KEY = 'fv_auth_token_v1'

function getStoredToken() {
  try {
    return window.localStorage.getItem(TOKEN_STORAGE_KEY)
  } catch {
    return null
  }
}

/**
 * Builds a URLSearchParams string from a plain object, skipping
 * undefined/null/empty-string values so optional filters stay optional.
 */
export function buildQuery(params = {}) {
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, value)
    }
  })
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

/**
 * Normalizes a failed response into the API's documented error shape
 * (see API_CONTRACT.md → Error format) so calling code can rely on
 * consistent fields regardless of whether it's a network failure or
 * a structured 4xx/5xx from the backend.
 */
async function toApiError(response, path) {
  let body = null
  try {
    body = await response.json()
  } catch {
    // response wasn't JSON — fall through to a generic error
  }

  return {
    timestamp: body?.timestamp || new Date().toISOString(),
    status: body?.status ?? response.status,
    error: body?.error || response.statusText || 'ERROR',
    message: body?.message || 'Something went wrong. Please try again.',
    path: body?.path || path,
  }
}

/**
 * Performs a GET request against the API and returns parsed JSON.
 * Throws the normalized error shape above on failure.
 */
export async function apiGet(path, { signal } = {}) {
  const url = `${API_BASE_URL}${path}`
  const token = getStoredToken()
  let response
  try {
    response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      signal,
    })
  } catch (networkError) {
    if (networkError.name === 'AbortError') throw networkError
    throw {
      timestamp: new Date().toISOString(),
      status: 0,
      error: 'NETWORK_ERROR',
      message: 'Could not reach the server. Check your connection.',
      path,
    }
  }

  if (!response.ok) {
    throw await toApiError(response, path)
  }

  return response.json()
}

/**
 * Performs a POST request against the API and returns parsed JSON.
 * Automatically attaches the stored JWT token (if any) as a Bearer header.
 * Throws the normalized error shape above on failure.
 */
export async function apiPost(path, body, { signal } = {}) {
  const url = `${API_BASE_URL}${path}`
  const token = getStoredToken()

  let response
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(body),
      signal,
    })
  } catch (networkError) {
    if (networkError.name === 'AbortError') throw networkError
    throw {
      timestamp: new Date().toISOString(),
      status: 0,
      error: 'NETWORK_ERROR',
      message: 'Could not reach the server. Check your connection.',
      path,
    }
  }

  if (!response.ok) {
    throw await toApiError(response, path)
  }

  return response.json()
}

/**
 * Performs a request with the given HTTP method and JSON body, returning
 * parsed JSON (or null for a 204/empty response). Shared by apiPut/apiPatch/
 * apiDelete so they get the same error-normalization and auth-header
 * behavior as apiGet/apiPost above.
 */
async function apiRequest(method, path, body, { signal } = {}) {
  const url = `${API_BASE_URL}${path}`
  const token = getStoredToken()

  let response
  try {
    response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    })
  } catch (networkError) {
    if (networkError.name === 'AbortError') throw networkError
    throw {
      timestamp: new Date().toISOString(),
      status: 0,
      error: 'NETWORK_ERROR',
      message: 'Could not reach the server. Check your connection.',
      path,
    }
  }

  if (!response.ok) {
    throw await toApiError(response, path)
  }

  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

export function apiPut(path, body, opts) {
  return apiRequest('PUT', path, body, opts)
}

export function apiPatch(path, body, opts) {
  return apiRequest('PATCH', path, body, opts)
}

export function apiDelete(path, opts) {
  return apiRequest('DELETE', path, undefined, opts)
}
