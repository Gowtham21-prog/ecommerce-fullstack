import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import { ToastProvider } from './components/common/Toast'
import ProtectedRoute from './components/common/ProtectedRoute'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CategoriesPage from './pages/CategoriesPage'
import CartPage from './pages/CartPage'
import CheckoutPage from './pages/CheckoutPage'
import OrdersPage from './pages/OrdersPage'
import OrderDetailPage from './pages/OrderDetailPage'
import WishlistPage from './pages/WishlistPage'
import AboutPage from './pages/AboutPage'
import JournalPage from './pages/JournalPage'
import NotFoundPage from './pages/NotFoundPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SellerLayout from './pages/seller/SellerLayout'
import SellerDashboardPage from './pages/seller/SellerDashboardPage'
import SellerProductsPage from './pages/seller/SellerProductsPage'
import SellerProductFormPage from './pages/seller/SellerProductFormPage'
import SellerOrdersPage from './pages/seller/SellerOrdersPage'

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/journal" element={<JournalPage />} />

          <Route
            path="/seller"
            element={
              <ProtectedRoute allowedRoles={['SELLER', 'ADMIN']}>
                <SellerLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<SellerDashboardPage />} />
            <Route path="products" element={<SellerProductsPage />} />
            <Route path="products/new" element={<SellerProductFormPage />} />
            <Route path="products/:id/edit" element={<SellerProductFormPage />} />
            <Route path="orders" element={<SellerOrdersPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </ToastProvider>
  )
}
