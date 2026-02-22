import { useState } from 'react'
import PropTypes from 'prop-types'
import { authApi } from '../utils/api'

export default function AuthScreen({ onAuthSuccess }) {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      if (mode === 'register') {
        await authApi.register(name, email, password)
      } else {
        await authApi.login(email, password)
      }
      onAuthSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const switchMode = () => {
    setMode(m => (m === 'login' ? 'register' : 'login'))
    setError('')
    setName('')
    setEmail('')
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-[#f3f0ea] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <h1 className="font-['Syne'] text-2xl font-bold text-[#1a1917] uppercase tracking-[0.1em]">
            Smart Notes
          </h1>
          <div className="mt-2 mx-auto w-8 h-0.5 bg-[#0d9488] rounded-full" />
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#e6e2db] p-7">
          <h2 className="font-['Syne'] text-base font-bold text-[#1a1917] mb-5">
            {mode === 'login' ? 'Sign in' : 'Create account'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <div>
                <label className="block text-[11px] text-[#a09d98] font-['Manrope'] uppercase tracking-[0.1em] mb-1.5">
                  Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full px-3.5 py-2.5 text-sm bg-[#fafaf8] border border-[#e6e2db] rounded-xl text-[#1a1917] placeholder-[#c4c0b8] focus:outline-none focus:border-[#0d9488] font-['Manrope'] transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] text-[#a09d98] font-['Manrope'] uppercase tracking-[0.1em] mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-[#fafaf8] border border-[#e6e2db] rounded-xl text-[#1a1917] placeholder-[#c4c0b8] focus:outline-none focus:border-[#0d9488] font-['Manrope'] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#a09d98] font-['Manrope'] uppercase tracking-[0.1em] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-[#fafaf8] border border-[#e6e2db] rounded-xl text-[#1a1917] placeholder-[#c4c0b8] focus:outline-none focus:border-[#0d9488] font-['Manrope'] transition-colors"
              />
            </div>

            {error && (
              <p className="text-xs text-red-500 font-['Manrope'] bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-2.5 bg-[#0d9488] hover:bg-[#0f766e] text-white text-sm font-['Manrope'] font-semibold rounded-xl transition-colors shadow-sm disabled:opacity-60 mt-1"
            >
              {submitting
                ? mode === 'login'
                  ? 'Signing in...'
                  : 'Creating account...'
                : mode === 'login'
                ? 'Sign in'
                : 'Create account'}
            </button>
          </form>

          <p className="mt-5 text-center text-xs text-[#a09d98] font-['Manrope']">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={switchMode}
              className="text-[#0d9488] hover:text-[#0f766e] font-medium transition-colors"
            >
              {mode === 'login' ? 'Register' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

AuthScreen.propTypes = {
  onAuthSuccess: PropTypes.func.isRequired,
}
