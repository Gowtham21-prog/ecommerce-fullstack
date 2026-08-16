import { Link } from 'react-router-dom'
import Button from '../components/common/Button'
import './NotFoundPage.css'

export default function NotFoundPage() {
  return (
    <div className="container not-found">
      <span className="not-found__code">404</span>
      <h1 className="not-found__title">This page wandered off.</h1>
      <p className="not-found__description">
        The page you're looking for doesn't exist, or may have moved.
      </p>
      <Button as={Link} to="/" variant="primary" size="lg">
        Back to home
      </Button>
    </div>
  )
}
