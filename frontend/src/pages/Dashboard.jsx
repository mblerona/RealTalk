import { useState, useEffect, useCallback } from 'react'
import { reportsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts'

const STATUSES = ['pending', 'reviewed', 'resolved']
const STATUS_LABELS  = { pending: 'Pending', reviewed: 'Reviewed', resolved: 'Resolved' }
const STATUS_COLORS  = {
  pending:  'bg-amber-100 text-amber-700 border-amber-200',
  reviewed: 'bg-blue-100  text-blue-700  border-blue-200',
  resolved: 'bg-green-100 text-green-700 border-green-200',
}
const STATUS_BTN = {
  pending:  'bg-amber-500 hover:bg-amber-600',
  reviewed: 'bg-blue-500  hover:bg-blue-600',
  resolved: 'bg-green-500 hover:bg-green-600',
}
const TYPE_COLORS = {
  vaping: '#3B82F6', smoking: '#F97316',
  fighting: '#EF4444', bullying: '#EAB308', other: '#6B7280',
}
const TYPE_EMOJIS = { vaping: '💨', smoking: '🚬', fighting: '👊', bullying: '😟', other: '📌' }

// ── Detail Modal ─────────────────────────────────────────────────────────────
function ReportModal({ report, onClose, onStatusChange, updating }) {
  if (!report) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle (mobile) */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        <div className="px-6 pb-8 pt-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-bg border border-border">
                {TYPE_EMOJIS[report.report_type]}
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-dark capitalize">{report.report_type}</h3>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium border ${STATUS_COLORS[report.status]}`}>
                  {STATUS_LABELS[report.status]}
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-muted hover:text-dark transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Meta */}
          <div className="bg-bg rounded-2xl border border-border p-4 mb-5 space-y-2">
            {report.location && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted w-20 shrink-0">Location</span>
                <span className="text-dark font-medium">📍 {report.location}</span>
              </div>
            )}
            {report.incident_date && (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted w-20 shrink-0">When</span>
                <span className="text-dark font-medium">🕐 {new Date(report.incident_date).toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted w-20 shrink-0">Received</span>
              <span className="text-dark font-medium">📅 {new Date(report.created_at).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted w-20 shrink-0">Report ID</span>
              <span className="text-dark font-mono text-xs truncate">{report.anonymous_id.slice(0, 16)}…</span>
            </div>
          </div>

          {/* Description */}
          {report.description ? (
            <div className="mb-6">
              <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Description</p>
              <p className="text-sm text-dark leading-relaxed whitespace-pre-wrap">{report.description}</p>
            </div>
          ) : (
            <div className="mb-6">
              <p className="text-xs font-medium text-muted uppercase tracking-widest mb-2">Description</p>
              <p className="text-sm text-muted italic">No description provided.</p>
            </div>
          )}

          {/* Status update */}
          <div>
            <p className="text-xs font-medium text-muted uppercase tracking-widest mb-3">Update Status</p>
            <div className="grid grid-cols-3 gap-2">
              {STATUSES.map(s => (
                <button
                  key={s}
                  disabled={updating || report.status === s}
                  onClick={() => onStatusChange(report.id, s)}
                  className={`py-2.5 rounded-xl text-sm font-semibold border transition-all
                    ${report.status === s
                      ? STATUS_COLORS[s] + ' cursor-default'
                      : `bg-white border-border text-muted hover:text-white hover:border-transparent ${STATUS_BTN[s]}`}
                    ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updating && report.status !== s ? '…' : STATUS_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [reports, setReports]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [typeFilter, setTypeFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selected, setSelected]     = useState(null)   // report open in modal
  const [updatingId, setUpdatingId] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || user.role !== 'school') { navigate('/login'); return }
    reportsAPI.mySchool()
      .then(r => setReports(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [user])

  const handleStatusChange = useCallback(async (reportId, newStatus) => {
    setUpdatingId(reportId)
    try {
      await reportsAPI.updateStatus(reportId, newStatus)
      setReports(prev => prev.map(r => r.id === reportId ? { ...r, status: newStatus } : r))
      // keep modal in sync
      setSelected(prev => prev?.id === reportId ? { ...prev, status: newStatus } : prev)
    } catch {
      // could add toast here
    } finally {
      setUpdatingId(null)
    }
  }, [])

  // Apply both filters
  const filtered = reports
    .filter(r => typeFilter   === 'all' || r.report_type === typeFilter)
    .filter(r => statusFilter === 'all' || r.status      === statusFilter)

  // Chart data (always from all reports, not filtered)
  const counts = reports.reduce((acc, r) => {
    acc[r.report_type] = (acc[r.report_type] || 0) + 1
    return acc
  }, {})
  const chartData = Object.entries(counts).map(([type, count]) => ({ type, count }))

  // Status counts for filter pills
  const statusCounts = reports.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1
    return acc
  }, {})

  return (
    <>
      <div>
        {/* Page header */}
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
                    <Cell key={i} fill={TYPE_COLORS[entry.type] || '#6B7280'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Type filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-2 scrollbar-hide">
          {['all', 'vaping', 'smoking', 'fighting', 'bullying', 'other'].map(f => (
            <button
              key={f}
              onClick={() => setTypeFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors
                ${typeFilter === f ? 'bg-primary border-primary text-white' : 'bg-white border-border text-muted hover:text-dark'}`}
            >
              {f === 'all' ? `All types (${reports.length})` : `${TYPE_EMOJIS[f]} ${f}`}
            </button>
          ))}
        </div>

        {/* Status filter */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {[['all', 'Any status'], ...STATUSES.map(s => [s, STATUS_LABELS[s]])].map(([val, label]) => (
            <button
              key={val}
              onClick={() => setStatusFilter(val)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap border transition-colors
                ${statusFilter === val
                  ? val === 'all' ? 'bg-dark border-dark text-white' : STATUS_COLORS[val]
                  : 'bg-white border-border text-muted hover:text-dark'}`}
            >
              {val === 'all' ? label : `${label}${statusCounts[val] ? ` (${statusCounts[val]})` : ''}`}
            </button>
          ))}
        </div>

        {/* Reports list */}
        {loading ? (
          <p className="text-center text-muted py-12">Loading reports...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-border p-12 text-center">
            <div className="text-4xl mb-3">📭</div>
            <p className="text-muted text-sm">No reports match these filters.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(report => (
              <button
                key={report.id}
                onClick={() => setSelected(report)}
                className="w-full text-left bg-white rounded-2xl border border-border shadow-card p-4 hover:border-gray-300 hover:shadow-md transition-all active:scale-[0.99]"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{TYPE_EMOJIS[report.report_type]}</span>
                    <span className="font-semibold text-dark capitalize">{report.report_type}</span>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border shrink-0 ${STATUS_COLORS[report.status]}`}>
                    {STATUS_LABELS[report.status]}
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted mb-2">
                  {report.location && <span>📍 {report.location}</span>}
                  {report.incident_date && <span>🕐 {new Date(report.incident_date).toLocaleString()}</span>}
                  <span>📅 {new Date(report.created_at).toLocaleDateString()}</span>
                </div>
                {report.description && (
                  <p className="text-sm text-muted line-clamp-2">{report.description}</p>
                )}
                <p className="text-xs text-primary font-medium mt-2">Tap to view details →</p>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      <ReportModal
        report={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
        updating={updatingId === selected?.id}
      />
    </>
  )
}
