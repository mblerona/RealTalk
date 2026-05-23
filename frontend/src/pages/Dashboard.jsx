import { useState, useEffect } from 'react'
import { reportsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const TYPE_COLORS = {
  vaping: '#3B82F6', smoking: '#F97316',
  fighting: '#EF4444', bullying: '#EAB308', other: '#6B7280',
}
const TYPE_EMOJIS = { vaping: '💨', smoking: '🚬', fighting: '👊', bullying: '😟', other: '📌' }
const STATUS_COLORS = { pending: 'bg-amber-100 text-amber-700', reviewed: 'bg-blue-100 text-blue-700', resolved: 'bg-green-100 text-green-700' }

export default function Dashboard() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'school') { navigate('/login'); return }
    reportsAPI.mySchool()
      .then(r => setReports(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const filtered = filter === 'all' ? reports : reports.filter(r => r.report_type === filter)

  // chart data
  const counts = reports.reduce((acc, r) => {
    acc[r.report_type] = (acc[r.report_type] || 0) + 1
    return acc
  }, {})
  const chartData = Object.entries(counts).map(([type, count]) => ({ type, count }))

  return (
    <div>
      <div className="mb-6">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-1">School Dashboard</p>
        <h2 className="font-display text-3xl font-bold text-dark">{user?.username}</h2>
        <p className="text-muted text-sm mt-1">{reports.length} anonymous report{reports.length !== 1 ? 's' : ''} received</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {Object.entries(TYPE_EMOJIS).map(([type, emoji]) => (
          <div key={type} className="bg-white rounded-2xl p-4 border border-border shadow-card text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="font-display text-2xl font-bold text-dark">{counts[type] || 0}</div>
            <div className="text-xs text-muted capitalize">{type}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-border shadow-card mb-6">
          <h3 className="font-semibold text-dark mb-4">Reports by Type</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
              <XAxis dataKey="type" tick={{ fill: '#8B8680', fontSize: 12 }} />
              <YAxis tick={{ fill: '#8B8680', fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E8E4DC' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, i) => (
                  <rect key={i} fill={TYPE_COLORS[entry.type] || '#6B7280'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {['all', 'vaping', 'smoking', 'fighting', 'bullying', 'other'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors
              ${filter === f ? 'bg-primary border-primary text-white' : 'bg-white border-border text-muted hover:text-dark'}`}
          >
            {f === 'all' ? `All (${reports.length})` : `${TYPE_EMOJIS[f]} ${f}`}
          </button>
        ))}
      </div>

      {/* Reports list */}
      {loading ? (
        <p className="text-center text-muted py-12">Loading reports...</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-muted text-sm">No reports yet{filter !== 'all' ? ` for ${filter}` : ''}.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(report => (
            <div key={report.id} className="bg-white rounded-2xl border border-border shadow-card p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{TYPE_EMOJIS[report.report_type]}</span>
                  <span className="font-semibold text-dark capitalize">{report.report_type}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[report.status]}`}>
                  {report.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-2">
                {report.location && <span>📍 {report.location}</span>}
                {report.incident_date && <span>🕐 {new Date(report.incident_date).toLocaleString()}</span>}
                <span>📅 Received {new Date(report.created_at).toLocaleDateString()}</span>
              </div>
              {report.description && (
                <p className="text-sm text-dark bg-bg rounded-xl px-3 py-2 border border-border">{report.description}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
