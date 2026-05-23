import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    username: '', password: '', full_name: '', email: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async () => {
    if (!form.username || !form.password) return setError('Please fill in all fields')
    if (mode === 'register' && (!form.full_name || !form.email))
      return setError('Full school name and email are required')

    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        await login(form.username, form.password)
      } else {
        await register(form.username, form.password, 'school', form.full_name, form.email)
      }
      navigate('/dashboard')
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">RealTalk</p>
          <h1 className="font-display text-3xl font-bold text-dark">School Portal</h1>
          <p className="text-muted text-sm mt-2">View anonymous reports from your students</p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-card border border-border">
          {/* Tab switcher */}
          <div className="flex bg-bg rounded-xl p-1 mb-6 border border-border">
            {[['login', 'Sign In'], ['register', 'Register School']].map(([m, label]) => (
              <button key={m} onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
                  ${mode === m ? 'bg-white text-dark shadow-sm border border-border' : 'text-muted hover:text-dark'}`}>
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {/* Register-only fields */}
            {mode === 'register' && (
              <>
                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    Official school full name <span className="text-primary">*</span>
                  </label>
                  <input
                    type="text"
                    value={form.full_name}
                    onChange={e => update('full_name', e.target.value)}
                    placeholder="e.g. SOU Rade Jovcevski Korcagin"
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted mb-1.5">
                    School email <span className="text-primary">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    placeholder="info@yourschool.edu.mk"
                    className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={e => update('username', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="e.g. sou_skopje"
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-muted mb-1.5">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={e => update('password', e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="••••••••"
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              />
            </div>

            {error && (
              <p className="text-primary text-xs text-center bg-red-50 rounded-lg py-2 px-3 border border-red-100">
                {error}
              </p>
            )}

            <button onClick={handleSubmit} disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50 mt-2">
              {loading ? '...' : mode === 'login' ? 'Sign In' : 'Register School'}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-muted hover:text-primary transition">← Back to RealTalk</Link>
        </div>
        <p className="text-center text-xs text-muted mt-4">
          Students don't need an account — reports are always anonymous.
        </p>
      </div>
    </div>
  )
}