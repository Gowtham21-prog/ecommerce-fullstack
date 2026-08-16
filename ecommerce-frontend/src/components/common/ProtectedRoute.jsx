import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Route guard. Wrap a <Route element={...}> with this component.
 *
 * Usage:
 *   <Route path="/orders" element={
 *     <ProtectedRoute><OrdersPage /></ProtectedRoute>
 *   } />
 *
 * Restrict by role (e.g. seller-only pages):
 *   <Route path="/seller/dashboard" element={
 *     <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}><SellerDashboard /></ProtectedRoute>
 *   } />
 */
export default function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    // Auth state is still being validated against the backend on first load.
    // Render nothing (or swap for a spinner) rather than redirecting too early.
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />
  }

  return children
}
