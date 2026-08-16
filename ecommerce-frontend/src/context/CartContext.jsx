import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react'
import * as cartService from '../services/cartService'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

/**
 * Flattens the API's {id, product, quantity} cart item shape into the
 * flat {id: productId, ...productFields, quantity} shape the rest of the
 * app (CartPage, CartDrawer, ProductCard) already expects, so none of
 * those components need to change now that the cart is server-backed.
 */
function flatten(apiItems) {
  return apiItems.map((item) => ({
    ...item.product,
    id: item.product.id,
    quantity: item.quantity,
  }))
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART': {
      const { items, subtotal, itemCount } = action.payload
      return { ...state, items: flatten(items), subtotal, itemCount, isLoading: false }
    }
    case 'RESET':
      return { items: [], subtotal: 0, itemCount: 0, isLoading: false, isDrawerOpen: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'OPEN_DRAWER':
      return { ...state, isDrawerOpen: true }
    case 'CLOSE_DRAWER':
      return { ...state, isDrawerOpen: false }
    default:
      return state
  }
}

const initialState = { items: [], subtotal: 0, itemCount: 0, isLoading: false, isDrawerOpen: false }

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { isAuthenticated } = useAuth()

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      dispatch({ type: 'RESET' })
      return
    }
    try {
      const cart = await cartService.getCart()
      dispatch({ type: 'SET_CART', payload: cart })
    } catch {
      // Not authenticated / network hiccup — leave cart empty rather than crash the UI.
      dispatch({ type: 'RESET' })
    }
  }, [isAuthenticated])

  // Load the cart whenever auth state changes (login/logout).
  useEffect(() => {
    refresh()
  }, [refresh])

  const addItem = useCallback(async (product, quantity = 1) => {
    const cart = await cartService.addToCart(product.id, quantity)
    dispatch({ type: 'SET_CART', payload: cart })
    dispatch({ type: 'OPEN_DRAWER' })
  }, [])

  const removeItem = useCallback(async (id) => {
    const cart = await cartService.removeFromCart(id)
    dispatch({ type: 'SET_CART', payload: cart })
  }, [])

  const updateQuantity = useCallback(async (id, quantity) => {
    if (quantity < 1) return
    const cart = await cartService.updateCartItem(id, quantity)
    dispatch({ type: 'SET_CART', payload: cart })
  }, [])

  const clearCart = useCallback(async () => {
    const cart = await cartService.clearCart()
    dispatch({ type: 'SET_CART', payload: cart })
  }, [])

  const openDrawer = useCallback(() => dispatch({ type: 'OPEN_DRAWER' }), [])
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [])

  const value = useMemo(
    () => ({
      items: state.items,
      isDrawerOpen: state.isDrawerOpen,
      isLoading: state.isLoading,
      itemCount: state.itemCount,
      subtotal: state.subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      refresh,
    }),
    [
      state.items,
      state.isDrawerOpen,
      state.isLoading,
      state.itemCount,
      state.subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      openDrawer,
      closeDrawer,
      refresh,
    ]
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
