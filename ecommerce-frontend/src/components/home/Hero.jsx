import { Link } from 'react-router-dom'
import Button from '../common/Button'
import Icon from '../common/Icon'
import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__copy">
          <span className="hero__eyebrow">Autumn Collection — 2026</span>
          <h1 className="hero__title">
            Objects built to
            <br />
            <span className="hero__title-accent">outlast the trend.</span>
          </h1>
          <p className="hero__description">
            Fielding &amp; Vane sources considered goods from small workshops —
            furniture, lighting, and everyday tools made to be repaired, not replaced.
          </p>
          <div className="hero__actions">
            <Button as={Link} to="/shop" size="lg" variant="primary">
              Shop the collection
            </Button>
            <Button as={Link} to="/about" size="lg" variant="ghost" icon={<Icon name="arrowUpRight" />}>
              Our story
            </Button>
          </div>
        </div>

        <div className="hero__media">
          <div className="hero__frame hero__frame--main">
            <img
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=1000&q=80"
              alt="Oak lounge chair in a sunlit room"
              className="hero__image"
            />
          </div>
          <div className="hero__frame hero__frame--accent">
            <img
              src="https://images.unsplash.com/photo-1524634126442-357e0eac3c14?w=700&q=80"
              alt="Brushed brass arc floor lamp"
              className="hero__image"
            />
          </div>
          <div className="hero__stat-card">
            <span className="hero__stat-number">12</span>
            <span className="hero__stat-label">Independent workshops<br />we partner with</span>
          </div>
        </div>
      </div>
    </section>
  )
}
