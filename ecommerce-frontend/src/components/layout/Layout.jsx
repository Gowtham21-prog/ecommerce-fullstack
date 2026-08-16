import { useEffect } from 'react'
import { useLocation, Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import TrustBar from './TrustBar'
import CartDrawer from '../cart/CartDrawer'

export default function Layout() {
  const location = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' })
  }, [location.pathname])

  return (
    <>
      <TrustBar />
      <Header />
      <main id="main-content">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
    </>
  )
}
