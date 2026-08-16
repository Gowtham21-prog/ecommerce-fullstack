import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import * as authService from '../services/authService'

const AuthContext = createContext(null)

const TOKEN_STORAGE_KEY = 'fv_auth_token_v1'
const USER_STORAGE_KEY = 'fv_auth_user_v1'

function loadInitialState() {
  if (typeof window === 'undefined') {
    return { user: null, token: null, isLoading: false }
  }
  try {
    const token = window.localStorage.getItem(TOKEN_STORAGE_KEY)
    const rawUser = window.localStorage.getItem(USER_STORAGE_KEY)
    const user = rawUser ? JSON.parse(rawUser) : null
    // If we have a token, re-validate it against the backend on mount
    // (handled in the effect below) — start in a loading state so the
    // rest of the app doesn't flash "logged out" then "logged in".
    return { user, token, isLoading: Boolean(token) }
  } catch {
    return { user: null, token: null, isLoading: false }
  }
}

function persist(token, user) {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_STORAGE_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_STORAGE_KEY)
    }
    if (user) {
      window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(USER_STORAGE_KEY)
    }
  } catch {
    // storage unavailable (private browsing, quota) — fail silently
  }
}

function authReducer(state, action) {
  switch (action.type) {
    case 'AUTH_SUCCESS': {
      const { token, user } = action.payload
      persist(token, user)
      return { ...state, token, user, isLoading: false }
    }
    case 'LOGOUT': {
      persist(null, null)
      return { ...state, token: null, user: null, isLoading: false }
    }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    default:
      return state
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, undefined, loadInitialState)

  // On mount, if a token was restored from storage, validate it against
  // the backend and refresh the user object. If it's invalid/expired,
  // log out silently so the UI doesn't stay in a stale "logged in" state.
  useEffect(() => {
    if (!state.token) return

    let cancelled = false
    authService
      .getCurrentUser()
      .then((user) => {
        if (cancelled) return
        dispatch({ type: 'AUTH_SUCCESS', payload: { token: state.token, user } })
      })
      .catch(() => {
        if (cancelled) return
        dispatch({ type: 'LOGOUT' })
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const login = useCallback(async (email, password) => {
    const result = await authService.login({ email, password })
    const { token, ...user } = result
    dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } })
    return user
  }, [])

  const register = useCallback(async ({ name, email, password, role }) => {
    const result = await authService.register({ name, email, password, role })
    const { token, ...user } = result
    dispatch({ type: 'AUTH_SUCCESS', payload: { token, user } })
    return user
  }, [])

  const logout = useCallback(() => {
    dispatch({ type: 'LOGOUT' })
  }, [])

  const value = useMemo(
    () => ({
      user: state.user,
      token: state.token,
      isLoading: state.isLoading,
      isAuthenticated: Boolean(state.user && state.token),
      login,
      register,
      logout,
    }),
    [state.user, state.token, state.isLoading, login, register, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
