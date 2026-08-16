import { NavLink, Outlet } from 'react-router-dom'
import './SellerLayout.css'

const SELLER_NAV = [
  { label: 'Overview', to: '/seller/dashboard', end: true },
  { label: 'Products', to: '/seller/products' },
  { label: 'Orders', to: '/seller/orders' },
]

export default function SellerLayout() {
  return (
    <div className="container seller-layout">
      <aside className="seller-layout__sidebar">
        <h2 className="seller-layout__heading">Seller tools</h2>
        <nav aria-label="Seller navigation">
          {SELLER_NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `seller-layout__link ${isActive ? 'seller-layout__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="seller-layout__content">
        <Outlet />
      </div>
    </div>
  )
}
