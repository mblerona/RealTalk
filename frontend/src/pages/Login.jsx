import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Shared input style ────────────────────────────────────────────────────────
const INPUT = 'w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition'
const LABEL = 'block text-xs font-medium text-muted mb-1.5'

// ── Student panel ─────────────────────────────────────────────────────────────
function StudentPanel() {
  const [mode, setMode]       = useState('login')   // 'login' | 'signup'
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { login, registerStudent } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!username || !password) return setError('Please fill in all fields')
    if (mode === 'signup' && password.length < 6)
      return setError('Password must be at least 6 characters')

    setLoading(true)
    setError('')
    try {
      if (mode === 'login') {
        const data = await login(username, password)
        navigate(data.role === 'school' ? '/dashboard' : '/journal')
      } else {
        await registerStudent(username, password)
        navigate('/journal')
      }
    } catch (e) {
      setError(e.response?.data?.detail || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-card border border-border">
      {/* Tab switcher */}
      <div className="flex bg-bg rounded-xl p-1 mb-6 border border-border">
        {[['login', 'Sign In'], ['signup', 'Register']].map(([m, label]) => (
          <button key={m} onClick={() => { setMode(m); setError('') }}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors
              ${mode === m ? 'bg-white text-dark shadow-sm border border-border' : 'text-muted hover:text-dark'}`}>
            {label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label className={LABEL}>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. alex123"
            className={INPUT}
            autoComplete="username"
          />
        </div>
        <div>
          <label className={LABEL}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            className={INPUT}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {error && (
          <p className="text-primary text-xs text-center bg-red-50 rounded-lg py-2 px-3 border border-red-100">{error}</p>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
          {loading ? '...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        {mode === 'signup' && (
          <p className="text-xs text-muted text-center leading-relaxed">
            Just a username and password — no email or personal info needed. Your journal is private and only visible to you.
          </p>
        )}
      </div>
    </div>
  )
}

// ── School panel ──────────────────────────────────────────────────────────────
function SchoolPanel() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ username: '', password: '', full_name: '', email: '' })
  const [error, setError]   = useState('')
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
        {mode === 'register' && (
          <>
            <div>
              <label className={LABEL}>Official school name <span className="text-primary">*</span></label>
              <input type="text" value={form.full_name}
                onChange={e => update('full_name', e.target.value)}
                placeholder="e.g. SOU Rade Jovcevski Korcagin"
                className={INPUT} />
            </div>
            <div>
              <label className={LABEL}>School email <span className="text-primary">*</span></label>
              <input type="email" value={form.email}
                onChange={e => update('email', e.target.value)}
                placeholder="info@yourschool.edu.mk"
                className={INPUT} />
            </div>
          </>
        )}

        <div>
          <label className={LABEL}>Username</label>
          <input type="text" value={form.username}
            onChange={e => update('username', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="e.g. sou_skopje"
            className={INPUT} />
        </div>
        <div>
          <label className={LABEL}>Password</label>
          <input type="password" value={form.password}
            onChange={e => update('password', e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            placeholder="••••••••"
            className={INPUT} />
        </div>

        {error && (
          <p className="text-primary text-xs text-center bg-red-50 rounded-lg py-2 px-3 border border-red-100">{error}</p>
        )}

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
          {loading ? '...' : mode === 'login' ? 'Sign In' : 'Register School'}
        </button>
      </div>
    </div>
  )
}

// ── Main Login page ───────────────────────────────────────────────────────────
export default function Login() {
  const [role, setRole] = useState('student')   // 'student' | 'school'

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <p className="text-primary font-medium text-sm uppercase tracking-widest mb-2">RealTalk</p>
          <h1 className="font-display text-3xl font-bold text-dark">Welcome back</h1>
          <p className="text-muted text-sm mt-2">Choose who you are to continue</p>
        </div>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => setRole('student')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
              ${role === 'student'
                ? 'border-primary bg-red-50 shadow-card'
                : 'border-border bg-white hover:border-gray-300'}`}
          >
            <span className="text-3xl">🎒</span>
            <div>
              <p className={`text-sm font-semibold ${role === 'student' ? 'text-primary' : 'text-dark'}`}>Student</p>
              <p className="text-xs text-muted">Journal & check-ins</p>
            </div>
          </button>

          <button
            onClick={() => setRole('school')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all
              ${role === 'school'
                ? 'border-primary bg-red-50 shadow-card'
                : 'border-border bg-white hover:border-gray-300'}`}
          >
            <span className="text-3xl">🏫</span>
            <div>
              <p className={`text-sm font-semibold ${role === 'school' ? 'text-primary' : 'text-dark'}`}>School</p>
              <p className="text-xs text-muted">Login</p>
            </div>
          </button>
        </div>

        {/* Dynamic panel */}
        {role === 'student' ? <StudentPanel /> : <SchoolPanel />}

        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-muted hover:text-primary transition">← Back to RealTalk</Link>
        </div>
      </div>
    </div>
  )
}
