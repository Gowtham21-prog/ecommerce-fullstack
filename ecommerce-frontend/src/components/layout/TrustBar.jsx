import Icon from '../common/Icon'
import './TrustBar.css'

const ITEMS = [
  { icon: 'truck', label: 'Free shipping over ₹4,000' },
  { icon: 'shield', label: '2-year workmanship guarantee' },
  { icon: 'leaf', label: 'Responsibly sourced materials' },
]

export default function TrustBar() {
  return (
    <div className="trust-bar">
      <div className="container trust-bar__inner">
        {ITEMS.map((item) => (
          <div key={item.label} className="trust-bar__item">
            <Icon name={item.icon} size={18} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
