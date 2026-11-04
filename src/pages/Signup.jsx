
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react'
import { registerStudent } from '../services/api'
import './Auth.css'

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      const result = await registerStudent({
        fullName: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      })

      setMessage(result.message || 'Registration successful!')

      // Redirect only after the backend confirms registration.
      window.setTimeout(() => {
        navigate('/login', {
          state: { registered: true, email: email.trim().toLowerCase() },
        })
      }, 1200)
    } catch (err) {
      setError(err.message || 'Unable to register. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-side">
        <Link to="/" className="auth-logo">
          <span className="logo-icon"><Zap size={22} /></span>
          Career<span>Forge</span>
        </Link>

        <div className="auth-welcome">
          <span className="auth-kicker">START YOUR JOURNEY</span>
          <h1>Build the future you want.</h1>
          <p>
            Create your account to discover opportunities and
            prepare for your career goals.
          </p>
        </div>

        <p className="auth-tagline">
          Build Your Skills. Shape Your Future.
        </p>
      </section>

      <section className="auth-main">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to home
        </Link>

        <div className="auth-card">
          <span className="auth-kicker">GET STARTED</span>
          <h2>Create your account</h2>
          <p className="auth-description">
            Join CareerForge as a student.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              minLength={2}
              required
            />

            <label htmlFor="signup-email">Email address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="signup-password">Password</label>
            <div className="password-field">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                minLength={8}
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword((current) => !current)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <label htmlFor="confirm-password">Confirm password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              minLength={8}
              required
            />

            <p className="auth-help">
              Admin accounts will be provisioned separately for security.
            </p>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          {error && (
            <p className="auth-error" role="alert">{error}</p>
          )}

          {message && (
            <p className="auth-message" role="status">{message}</p>
          )}

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </section>
    </main>
  )
}

