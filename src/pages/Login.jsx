
import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Zap, ArrowLeft } from 'lucide-react'
import { loginStudent } from '../services/api'
import './Auth.css'

export default function Login() {
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState(location.state?.email || '')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    if (loading) return

    setError('')
    setLoading(true)

    try {
      const result = await loginStudent({
        email: email.trim().toLowerCase(),
        password,
      })

      if (!result.token || !result.student) {
        throw new Error('Login response is missing account details.')
      }

      // Save the same keys that ProtectedRoute checks.
      sessionStorage.setItem('careerforge_token', result.token)
      sessionStorage.setItem(
        'careerforge_student',
        JSON.stringify(result.student)
      )

      // Confirm that the token was saved before navigating.
      if (!sessionStorage.getItem('careerforge_token')) {
        throw new Error('Unable to save your login session.')
      }

      navigate('/dashboard', { replace: true })
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
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
          <span className="auth-kicker">WELCOME BACK</span>
          <h1>Your next chapter starts here.</h1>
          <p>
            Sign in to explore opportunities, improve your skills,
            and track your career progress.
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
          <span className="auth-kicker">WELCOME BACK</span>
          <h2>Log in to CareerForge</h2>
          <p className="auth-description">
            Enter your details to continue.
          </p>

          <form onSubmit={handleSubmit} className="auth-form">
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password</label>

            <div className="password-field">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
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

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          {error && (
            <p className="auth-error" role="alert">
              {error}
            </p>
          )}

          <p className="auth-switch">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  )
}
