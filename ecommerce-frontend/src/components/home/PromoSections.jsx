import Icon from '../common/Icon'
import Button from '../common/Button'
import { Link } from 'react-router-dom'
import './PromoSections.css'

const VALUES = [
  {
    icon: 'leaf',
    title: 'Responsibly made',
    copy: 'Every workshop we partner with is vetted for fair labor and sustainable materials.',
  },
  {
    icon: 'shield',
    title: 'Built to last',
    copy: 'A 2-year workmanship guarantee, and repair guides for everything we sell.',
  },
  {
    icon: 'truck',
    title: 'Considered delivery',
    copy: 'Carbon-offset shipping, packed in materials that break down or get reused.',
  },
]

export function ValueProps() {
  return (
    <section className="value-props">
      <div className="container value-props__grid">
        {VALUES.map((v) => (
          <div key={v.title} className="value-props__item">
            <div className="value-props__icon">
              <Icon name={v.icon} size={22} />
            </div>
            <h3 className="value-props__title">{v.title}</h3>
            <p className="value-props__copy">{v.copy}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function CTABanner() {
  return (
    <section className="cta-banner">
      <div className="container cta-banner__inner">
        <div className="cta-banner__text">
          <h2 className="cta-banner__title">
            Visit the workshop.
            <br />
            <span className="cta-banner__title-accent">See how it's made.</span>
          </h2>
          <p className="cta-banner__copy">
            Read the stories behind the makers we work with — from a third-generation
            joinery in Kerala to a single-room glass studio outside Pune.
          </p>
        </div>
        <Button as={Link} to="/journal" variant="inverse" size="lg">
          Read the journal
        </Button>
      </div>
    </section>
  )
}
