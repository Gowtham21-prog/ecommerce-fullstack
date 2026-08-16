import { Link } from 'react-router-dom'
import Icon from '../common/Icon'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__top">
        <div className="footer__brand">
          <span className="footer__logo">Fielding &amp; Vane</span>
          <p className="footer__tagline">
            Considered goods for daily use — made slowly, built to last, worth repairing.
          </p>
          <div className="footer__social">
            <a href="#" aria-label="Instagram" className="footer__social-link">
              <Icon name="instagram" size={18} />
            </a>
            <a href="#" aria-label="Pinterest" className="footer__social-link">
              <Icon name="pinterest" size={18} />
            </a>
          </div>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Shop</h4>
          <Link to="/shop" className="footer__link">All products</Link>
          <Link to="/shop?category=audio" className="footer__link">Audio</Link>
          <Link to="/shop?category=furniture" className="footer__link">Furniture</Link>
          <Link to="/shop?category=lighting" className="footer__link">Lighting</Link>
        </div>

        <div className="footer__col">
          <h4 className="footer__heading">Support</h4>
          <a href="#" className="footer__link">Shipping &amp; returns</a>
          <a href="#" className="footer__link">Care guide</a>
          <a href="#" className="footer__link">Contact us</a>
          <a href="#" className="footer__link">FAQ</a>
        </div>

        <div className="footer__col footer__col--newsletter">
          <h4 className="footer__heading">Stay in touch</h4>
          <p className="footer__newsletter-copy">
            Quiet, occasional notes on new arrivals. No spam, ever.
          </p>
          <form className="footer__newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email address"
              required
              className="footer__newsletter-input"
              aria-label="Email address"
            />
            <button type="submit" className="footer__newsletter-submit" aria-label="Subscribe">
              <Icon name="arrowUpRight" size={16} />
            </button>
          </form>
        </div>
      </div>

      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} Fielding &amp; Vane. All rights reserved.</span>
        <div className="footer__legal">
          <a href="#" className="footer__link">Privacy</a>
          <a href="#" className="footer__link">Terms</a>
        </div>
      </div>
    </footer>
  )
}
