import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import './AuthPages.css'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const redirectTo = location.state?.from?.pathname || '/'

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)
    try {
      await login(form.email, form.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err?.message || 'Invalid email or password.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Sign in</h1>
        <p className="auth-page__subtitle">Welcome back to Fielding &amp; Vane.</p>

        {error && (
          <div className="auth-page__error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <label className="auth-page__field">
            <span>Email</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </label>

          <label className="auth-page__field">
            <span>Password</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
            />
          </label>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>

        <p className="auth-page__footer">
          Don&apos;t have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  )
}
