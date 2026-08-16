import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/common/Button'
import './AuthPages.css'

const ROLES = [
  { value: 'CUSTOMER', label: 'Shop', description: 'Browse and buy products' },
  { value: 'SELLER', label: 'Sell', description: 'List and manage your own products' },
]

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  })
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleRoleSelect(role) {
    setForm((prev) => ({ ...prev, role }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setIsSubmitting(true)
    try {
      await register(form)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err?.message || 'Could not create your account. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container auth-page">
      <div className="auth-page__card">
        <h1 className="auth-page__title">Create an account</h1>
        <p className="auth-page__subtitle">Join Fielding &amp; Vane.</p>

        {error && (
          <div className="auth-page__error" role="alert">
            {error}
          </div>
        )}

        <form className="auth-page__form" onSubmit={handleSubmit}>
          <label className="auth-page__field">
            <span>Name</span>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </label>

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
              minLength={6}
              autoComplete="new-password"
            />
          </label>

          <div className="auth-page__field">
            <span>I want to</span>
            <div className="auth-page__role-toggle" role="radiogroup" aria-label="Account type">
              {ROLES.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  role="radio"
                  aria-checked={form.role === r.value}
                  className={`auth-page__role-option ${
                    form.role === r.value ? 'auth-page__role-option--active' : ''
                  }`}
                  onClick={() => handleRoleSelect(r.value)}
                >
                  <span className="auth-page__role-label">{r.label}</span>
                  <span className="auth-page__role-desc">{r.description}</span>
                </button>
              ))}
            </div>
          </div>

          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </Button>
        </form>

        <p className="auth-page__footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
