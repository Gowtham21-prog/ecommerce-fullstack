import { NavLink } from 'react-router-dom'
import Icon from '../common/Icon'
import './MobileMenu.css'

export default function MobileMenu({ isOpen, onClose, links }) {
  return (
    <div className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`} aria-hidden={!isOpen}>
      <div className="mobile-menu__backdrop" onClick={onClose} />
      <div className="mobile-menu__panel" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="mobile-menu__header">
          <span className="mobile-menu__title">Menu</span>
          <button className="mobile-menu__close" onClick={onClose} aria-label="Close menu">
            <Icon name="close" size={20} />
          </button>
        </div>
        <nav className="mobile-menu__nav">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={onClose}
              className={({ isActive }) =>
                `mobile-menu__link ${isActive ? 'mobile-menu__link--active' : ''}`
              }
            >
              {link.label}
              <Icon name="chevronRight" size={18} />
            </NavLink>
          ))}
        </nav>
        <div className="mobile-menu__footer">
          <p>Considered goods, delivered with care.</p>
        </div>
      </div>
    </div>
  )
}
