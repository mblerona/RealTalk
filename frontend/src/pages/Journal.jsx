import { useState, useEffect } from 'react'
import { journalAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const MOODS = [
  { score: 1, emoji: '😞', label: 'Rough', color: 'hover:bg-red-50' },
  { score: 2, emoji: '😕', label: 'Meh',   color: 'hover:bg-orange-50' },
  { score: 3, emoji: '😐', label: 'Okay',  color: 'hover:bg-yellow-50' },
  { score: 4, emoji: '🙂', label: 'Good',  color: 'hover:bg-green-50' },
  { score: 5, emoji: '😄', label: 'Great', color: 'hover:bg-emerald-50' },
]

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ mood_score: 0, faced_pressure: false, note: '' })
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    journalAPI.list().then(r => setEntries(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleSubmit = async () => {
    if (!form.mood_score) return setError('Please select your mood first')
    setSubmitting(true)
    setError('')
    try {
      const r = await journalAPI.create(form)
      setEntries(p => [r.data, ...p])
      setSaved(true)
      setForm({ mood_score: 0, faced_pressure: false, note: '' })
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Could not save. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const chartData = [...entries].reverse().slice(-14).map(e => ({
    date: new Date(e.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    mood: e.mood_score,
  }))

  const avgMood = entries.length ? (entries.reduce((a, e) => a + e.mood_score, 0) / entries.length).toFixed(1) : null

  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-dark mb-1">My Journal</h2>
      <p className="text-muted text-sm mb-6">Private daily check-ins — only you can see this.</p>

      {/* Check-in card */}
      <div className="bg-white rounded-2xl p-5 border border-border shadow-card mb-6">
        <h3 className="font-semibold text-dark mb-4">How are you feeling today?</h3>

        <div className="flex justify-between mb-5">
          {MOODS.map(({ score, emoji, label, color }) => (
            <button key={score} onClick={() => setForm(f => ({ ...f, mood_score: score }))}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${color}
                ${form.mood_score === score ? 'ring-2 ring-primary scale-110 bg-red-50' : ''}`}>
              <span className="text-2xl">{emoji}</span>
              <span className={`text-xs font-medium ${form.mood_score === score ? 'text-primary' : 'text-muted'}`}>{label}</span>
            </button>
          ))}
        </div>

        <button onClick={() => setForm(f => ({ ...f, faced_pressure: !f.faced_pressure }))}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border mb-4 transition-colors
            ${form.faced_pressure ? 'border-amber-300 bg-amber-50' : 'border-border hover:bg-bg'}`}>
          <span className="text-sm text-dark">I faced peer pressure today</span>
          <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
            ${form.faced_pressure ? 'border-amber-500 bg-amber-500' : 'border-border'}`}>
            {form.faced_pressure && <span className="text-white text-xs">✓</span>}
          </span>
        </button>

        <textarea value={form.note} onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
          placeholder="Anything on your mind? (optional)"
          rows={3}
          className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary resize-none placeholder-muted transition mb-4" />

        {error && <p className="text-primary text-xs mb-3 text-center">{error}</p>}

        {saved ? (
          <div className="w-full bg-green-50 border border-green-200 text-accent py-3 rounded-xl text-center text-sm font-semibold">✓ Saved!</div>
        ) : (
          <button onClick={handleSubmit} disabled={submitting}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
            {submitting ? 'Saving...' : 'Save Check-in'}
          </button>
        )}
      </div>

      {/* Chart */}
      {entries.length > 1 && (
        <div className="bg-white rounded-2xl p-5 border border-border shadow-card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-dark">Your Mood Trend</h3>
            {avgMood && <span className="text-xs text-muted">Avg: <strong className="text-dark">{avgMood}/5</strong></span>}
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="date" tick={{ fill: '#8B8680', fontSize: 11 }} />
              <YAxis domain={[1,5]} ticks={[1,2,3,4,5]} tick={{ fill: '#8B8680', fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E4DC', fontSize: 12 }}
                formatter={(v) => [MOODS.find(m => m.score === v)?.emoji + ' ' + MOODS.find(m => m.score === v)?.label, 'Mood']} />
              <Line type="monotone" dataKey="mood" stroke="#E8533A" strokeWidth={2} dot={{ fill: '#E8533A', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Past entries */}
      {loading ? (
        <p className="text-center text-muted text-sm py-8">Loading...</p>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-10 text-center">
          <p className="text-muted text-sm">Your first check-in will appear here.</p>
        </div>
      ) : (
        <div>
          <h3 className="font-semibold text-dark mb-3">Past Entries</h3>
          <div className="space-y-2">
            {entries.map(entry => {
              const mood = MOODS.find(m => m.score === entry.mood_score)
              return (
                <div key={entry.id} className="bg-white rounded-xl px-4 py-3 border border-border flex items-start gap-3">
                  <span className="text-2xl">{mood?.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-dark">{mood?.label}</span>
                      <span className="text-xs text-muted">{new Date(entry.created_at).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    {entry.faced_pressure && <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">Faced pressure</span>}
                    {entry.note && <p className="text-xs text-muted mt-1 truncate">{entry.note}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
