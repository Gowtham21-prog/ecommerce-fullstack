import { useEffect, useLayoutEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Icon from '../common/Icon'
import { useCart } from '../../context/CartContext'
import { useAuth } from '../../context/AuthContext'
import MobileMenu from './MobileMenu'
import SearchOverlay from './SearchOverlay'
import './Header.css'

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Categories', to: '/categories' },
  { label: 'Journal', to: '/journal' },
  { label: 'About', to: '/about' },
]

const THEME_STORAGE_KEY = 'fv_theme'

/**
 * Resolves the theme to use on first render: an explicit saved choice
 * takes priority, otherwise falls back to the OS-level preference.
 */
function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage unavailable (private browsing, quota) — fall through
  }
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export default function Header() {
  const { itemCount, openDrawer } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [theme, setTheme] = useState(getInitialTheme)

  // Applies synchronously before the browser paints, so there is no
  // flash of the wrong theme on first load or on route change.
  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.add('theme-transitions-disabled')
    root.setAttribute('data-theme', theme)
    // Force a reflow so the transition-disable class takes effect before
    // it's removed, then re-enable smooth theme transitions for toggles.
    root.getBoundingClientRect()
    const id = requestAnimationFrame(() => {
      root.classList.remove('theme-transitions-disabled')
    })
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      // storage unavailable — theme still applies for this session
    }
    return () => cancelAnimationFrame(id)
  }, [theme])

  // Keeps the theme in sync with the OS setting if the user has never
  // made an explicit choice on this device.
  useEffect(() => {
    let hasExplicitChoice = false
    try {
      hasExplicitChoice = window.localStorage.getItem(THEME_STORAGE_KEY) !== null
    } catch {
      hasExplicitChoice = false
    }
    if (hasExplicitChoice) return

    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e) => setTheme(e.matches ? 'dark' : 'light')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  function toggleTheme() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMenuOpen || isSearchOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen, isSearchOpen])

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="container header__inner">
          <button
            className="header__menu-btn"
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
          >
            <Icon name="menu" size={22} />
          </button>

          <Link to="/" className="header__logo" aria-label="Fielding & Vane home">
            <span className="header__logo-mark">F&amp;V</span>
            <span className="header__logo-word">Fielding &amp; Vane</span>
          </Link>

          <nav className="header__nav" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? 'header__nav-link--active' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <button
              className="header__icon-btn header__theme-toggle"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              aria-pressed={theme === 'dark'}
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <span className="header__theme-toggle-track">
                <span className="header__theme-toggle-thumb">
                  {theme === 'dark' ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="13"
                      height="13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="4.2" />
                      <path d="M12 2.5v2.4M12 19.1v2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M2.5 12h2.4M19.1 12h2.4M4.9 19.1l1.7-1.7M17.4 6.6l1.7-1.7" />
                    </svg>
                  )}
                </span>
              </span>
            </button>
            <button
              className="header__icon-btn"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search products"
            >
              <Icon name="search" size={20} />
            </button>
            {isAuthenticated ? (
              <div className="header__account">
                {(user?.role === 'SELLER' || user?.role === 'ADMIN') && (
                  <Link
                    to="/seller/dashboard"
                    className="header__icon-btn"
                    aria-label="Seller dashboard"
                    title="Seller dashboard"
                  >
                    <Icon name="shield" size={18} />
                  </Link>
                )}
                <Link to="/wishlist" className="header__icon-btn" aria-label="Wishlist" title="Wishlist">
                  <Icon name="heartOutline" size={19} />
                </Link>
                <Link to="/orders" className="header__icon-btn" aria-label="Your orders" title="Your orders">
                  <Icon name="truck" size={19} />
                </Link>
                <span className="header__account-name">{user.name}</span>
                <button
                  className="header__icon-btn"
                  onClick={logout}
                  aria-label="Log out"
                  title="Log out"
                >
                  <Icon name="close" size={18} />
                </button>
              </div>
            ) : (
              <Link to="/login" className="header__icon-btn" aria-label="Sign in">
                <Icon name="user" size={20} />
              </Link>
            )}
            <button
              className="header__icon-btn header__cart-btn"
              onClick={openDrawer}
              aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
            >
              <Icon name="bag" size={20} />
              {itemCount > 0 && (
                <span className="header__cart-count" aria-hidden="true">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        links={NAV_LINKS}
      />
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}