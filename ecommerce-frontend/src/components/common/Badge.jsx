import './Badge.css'

export default function Badge({ children, tone = 'ink' }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}
