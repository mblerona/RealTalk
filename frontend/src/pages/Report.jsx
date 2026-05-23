import { useState, useEffect } from 'react'
import { reportsAPI, schoolsAPI } from '../services/api'

const INCIDENT_TYPES = [
  { value: 'vaping',   label: 'Vaping',   emoji: '💨', color: 'border-blue-300 bg-blue-50 text-blue-700' },
  { value: 'smoking',  label: 'Smoking',  emoji: '🚬', color: 'border-orange-300 bg-orange-50 text-orange-700' },
  { value: 'fighting', label: 'Fighting', emoji: '👊', color: 'border-red-300 bg-red-50 text-red-700' },
  { value: 'bullying', label: 'Bullying', emoji: '😟', color: 'border-yellow-300 bg-yellow-50 text-yellow-700' },
  { value: 'other',    label: 'Other',    emoji: '📌', color: 'border-gray-300 bg-gray-50 text-gray-700' },
]

const LOCATIONS = ['Bathroom', 'Hallway', 'Classroom', 'Gym', 'Cafeteria', 'Schoolyard', 'Parking lot', 'Other']
const STEPS = ['Incident', 'Details', 'Review']

export default function Report() {
  const [step, setStep] = useState(0)
  const [schools, setSchools] = useState([])
  const [form, setForm] = useState({
    report_type: '', description: '', location: '',
    incident_date: '', school: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    schoolsAPI.list().then(r => setSchools(r.data)).catch(() => {})
  }, [])

  const update = (f, v) => setForm(p => ({ ...p, [f]: v }))

  const handleSubmit = async () => {
    if (!form.school) return setError('Please select a school')
    setLoading(true)
    setError('')
    try {
      await reportsAPI.submit({
        ...form,
        incident_date: form.incident_date ? new Date(form.incident_date).toISOString() : null,
      })
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 text-3xl">✓</div>
        <h2 className="font-display text-2xl font-bold text-dark mb-2">Report submitted</h2>
        <p className="text-muted max-w-xs mb-6 text-sm leading-relaxed">
          Your report is completely anonymous. The school counselor will review it.
          You did the right thing.
        </p>
        <button
          onClick={() => { setSubmitted(false); setStep(0); setForm({ report_type: '', description: '', location: '', incident_date: '', school: '' }) }}
          className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-600 transition"
        >
          Submit another report
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <h2 className="font-display text-3xl font-bold text-dark mb-1">Report an Incident</h2>
      <p className="text-muted text-sm mb-6">100% anonymous — your identity is never stored or shared.</p>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
              ${i < step ? 'bg-accent text-white' : i === step ? 'bg-primary text-white' : 'bg-border text-muted'}`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs font-medium ${i === step ? 'text-dark' : 'text-muted'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`w-8 h-px ${i < step ? 'bg-accent' : 'bg-border'}`} />}
          </div>
        ))}
      </div>

      {/* Step 0: Incident type */}
      {step === 0 && (
        <div>
          <p className="text-sm font-medium text-dark mb-4">What type of incident are you reporting?</p>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {INCIDENT_TYPES.map(({ value, label, emoji, color }) => (
              <button
                key={value}
                onClick={() => { update('report_type', value); setStep(1) }}
                className={`border-2 rounded-2xl p-4 text-left transition-all hover:scale-[1.02] hover:shadow-card
                  ${form.report_type === value ? color : 'border-border bg-white text-dark hover:border-gray-300'}`}
              >
                <div className="text-2xl mb-2">{emoji}</div>
                <div className="font-semibold text-sm">{label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Details */}
      {step === 1 && (
        <div className="space-y-5">
          {/* School selector */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Which school? <span className="text-primary">*</span></label>
            {schools.length > 0 ? (
              <select
                value={form.school}
                onChange={e => update('school', e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition"
              >
                <option value="">Select a school...</option>
                {schools.map(s => (
                  <option key={s.id} value={s.username}>
                    {s.full_name || s.username}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-xs text-muted bg-bg border border-border rounded-xl px-4 py-3">
                No schools registered yet. Ask your school to register on RealTalk.
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Where did it happen? <span className="text-muted">(optional)</span></label>
            <div className="flex flex-wrap gap-2">
              {LOCATIONS.map(loc => (
                <button
                  key={loc}
                  onClick={() => update('location', form.location === loc ? '' : loc)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-colors
                    ${form.location === loc
                      ? 'border-primary bg-red-50 text-primary font-medium'
                      : 'border-border bg-white text-muted hover:border-gray-400 hover:text-dark'}`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">When? <span className="text-muted">(optional)</span></label>
            <input
              type="datetime-local"
              value={form.incident_date}
              onChange={e => update('incident_date', e.target.value)}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-dark mb-2">Describe what happened <span className="text-muted">(optional)</span></label>
            <textarea
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Share as much or as little as you're comfortable with..."
              rows={4}
              className="w-full bg-bg border border-border rounded-xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-primary resize-none placeholder-muted transition"
            />
          </div>

          <div className="flex gap-3">
            <button onClick={() => setStep(0)} className="flex-1 border border-border bg-white text-dark py-3 rounded-xl font-semibold hover:bg-bg transition">Back</button>
            <button onClick={() => setStep(2)} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition">Continue</button>
          </div>
        </div>
      )}

      {/* Step 2: Review */}
      {step === 2 && (
        <div>
          <div className="bg-white rounded-2xl p-5 border border-border shadow-card mb-5 space-y-3">
            <h3 className="font-semibold text-dark">Review your report</h3>
            <div className="divide-y divide-border text-sm">
              {[
                ['Type', form.report_type],
                ['School', form.school || '—'],
                ['Location', form.location || '—'],
                ['Date', form.incident_date ? new Date(form.incident_date).toLocaleString() : '—'],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2">
                  <span className="text-muted">{k}</span>
                  <span className="font-medium text-dark capitalize">{v}</span>
                </div>
              ))}
            </div>
            {form.description && (
              <div className="pt-2 text-sm">
                <span className="text-muted block mb-1">Description</span>
                <span className="text-dark">{form.description}</span>
              </div>
            )}
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 mb-5 flex gap-2">
            <span>🔒</span>
            <span>This report is completely anonymous. No name, no account, no IP address is stored.</span>
          </div>

          {error && <p className="text-primary text-xs mb-4 text-center">{error}</p>}

          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border border-border bg-white text-dark py-3 rounded-xl font-semibold hover:bg-bg transition">Back</button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}