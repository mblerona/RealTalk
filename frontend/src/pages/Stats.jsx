import { useEffect, useState } from 'react'
import { statsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend, Cell, PieChart, Pie
} from 'recharts'

const TT = { contentStyle: { borderRadius: 8, border: '1px solid #E8E4DC', fontSize: 12 } }

const TYPE_COLORS = {
  vaping: '#3B82F6', smoking: '#F97316',
  fighting: '#EF4444', bullying: '#EAB308', other: '#6B7280',
}
const TYPE_EMOJIS = {
  vaping: '💨', smoking: '🚬', fighting: '👊', bullying: '😟', other: '📌',
}

const Section = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl p-5 border border-border shadow-card mb-5">
    <h3 className="font-semibold text-dark mb-0.5">{title}</h3>
    {subtitle && <p className="text-xs text-muted mb-4">{subtitle}</p>}
    {children}
  </div>
)

// ── School analytics view ─────────────────────────────────────────────────────
function SchoolStats({ hbsc }) {
  const [school, setSchool] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statsAPI.school().then(r => setSchool(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center text-muted pt-20">Loading analytics...</div>

  const typeData = Object.entries(school.by_type)
    .map(([type, count]) => ({ type, count, emoji: TYPE_EMOJIS[type] }))
    .filter(d => d.count > 0)

  const noData = school.total === 0

  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-dark mb-1">School Analytics</h2>
      <p className="text-muted text-sm mb-6">Based on anonymous reports submitted for your school.</p>

      {/* Summary tiles */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white rounded-2xl p-5 border border-border shadow-card text-center">
          <div className="font-display text-4xl font-bold text-primary">{school.total}</div>
          <div className="text-sm text-muted mt-1">Total Reports</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-border shadow-card text-center">
          <div className="font-display text-4xl font-bold text-amber-500">{school.pending}</div>
          <div className="text-sm text-muted mt-1">Pending Review</div>
        </div>
      </div>

      {noData ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center mb-5">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-muted text-sm">No reports yet. Once students start reporting, analytics will appear here.</p>
        </div>
      ) : (
        <>
          {/* Reports by type */}
          {typeData.length > 0 && (
            <Section title="Reports by Incident Type" subtitle="Total anonymous reports per category">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                  <XAxis dataKey="type" tick={{ fill: '#8B8680', fontSize: 12 }}
                    tickFormatter={v => TYPE_EMOJIS[v] + ' ' + v.charAt(0).toUpperCase() + v.slice(1)} />
                  <YAxis tick={{ fill: '#8B8680', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...TT} formatter={(v, n, p) => [v, p.payload.type]} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {typeData.map((entry, i) => (
                      <Cell key={i} fill={TYPE_COLORS[entry.type] || '#6B7280'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Section>
          )}

          {/* Reports over time */}
          {school.by_day.length > 1 && (
            <Section title="Reports Over Time" subtitle="Last 30 days — daily report count">
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={school.by_day}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
                  <XAxis dataKey="day" tick={{ fill: '#8B8680', fontSize: 11 }}
                    tickFormatter={v => new Date(v).toLocaleDateString('en', { month: 'short', day: 'numeric' })} />
                  <YAxis tick={{ fill: '#8B8680', fontSize: 12 }} allowDecimals={false} />
                  <Tooltip {...TT}
                    labelFormatter={v => new Date(v).toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })} />
                  <Line type="monotone" dataKey="count" stroke="#E8533A" strokeWidth={2}
                    dot={{ fill: '#E8533A', r: 4 }} name="Reports" />
                </LineChart>
              </ResponsiveContainer>
            </Section>
          )}

          {/* By location */}
          {school.by_location.length > 0 && (
            <Section title="Hotspot Locations" subtitle="Where incidents are most reported">
              <div className="space-y-3">
                {school.by_location.map((item, i) => {
                  const max = school.by_location[0].count
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-dark">📍 {item.location}</span>
                        <span className="font-bold text-dark">{item.count}</span>
                      </div>
                      <div className="h-2.5 bg-bg rounded-full overflow-hidden border border-border">
                        <div className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${(item.count / max) * 100}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </Section>
          )}
        </>
      )}

      {/* HBSC comparison — always shown */}
      <div className="border-t border-border pt-5 mt-2">
        <p className="text-xs font-medium text-muted uppercase tracking-widest mb-4">
          International Context — WHO/HBSC 2021/22
        </p>
        <Section title="Substance Use at Age 15 — Global Averages"
          subtitle="How these numbers compare internationally">
          <div className="space-y-3">
            {hbsc.substance_use_summary.map((item, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-dark">{item.label}</span>
                  <span className="font-bold text-dark">{item.percentage}%</span>
                </div>
                <div className="h-2 bg-bg rounded-full overflow-hidden border border-border">
                  <div className="h-full rounded-full"
                    style={{ width: `${item.percentage}%`, backgroundColor: ['#3B82F6','#60A5FA','#F97316','#FB923C'][i] }} />
                </div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      <p className="text-xs text-muted text-center mb-4">
        International data: WHO/HBSC Report 2021/22
      </p>
    </div>
  )
}

// ── Student global stats view ─────────────────────────────────────────────────
function StudentStats({ hbsc }) {
  return (
    <div>
      <h2 className="font-display text-3xl font-bold text-dark mb-1">The Real Numbers</h2>
      <p className="text-muted text-sm mb-6">WHO/HBSC 2021/22 — 280,000 teens across 50+ countries.</p>

      <Section title="Vaping vs Smoking by Age" subtitle="% of teens who have ever tried — international data">
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={hbsc.vaping_by_age.map((v, i) => ({
            age: `Age ${v.age}`,
            Vaping: v.percentage,
            Smoking: hbsc.smoking_by_age[i].percentage,
          }))}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
            <XAxis dataKey="age" tick={{ fill: '#8B8680', fontSize: 12 }} />
            <YAxis tick={{ fill: '#8B8680', fontSize: 12 }} unit="%" />
            <Tooltip {...TT} />
            <Legend />
            <Bar dataKey="Vaping"  fill="#3B82F6" radius={[4,4,0,0]} />
            <Bar dataKey="Smoking" fill="#F97316" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section title="Physical Fighting by Gender" subtitle="% of teens involved in physical fights">
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={hbsc.fighting_by_gender} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
            <XAxis type="number" tick={{ fill: '#8B8680', fontSize: 12 }} unit="%" />
            <YAxis dataKey="gender" type="category" tick={{ fill: '#8B8680', fontSize: 12 }} width={60} />
            <Tooltip {...TT} />
            <Bar dataKey="percentage" radius={[0,4,4,0]}>
              {hbsc.fighting_by_gender.map((_, i) => (
                <Cell key={i} fill={['#EF4444','#F97316','#6B7280'][i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Section>

      <Section title="Cyberbullying Rising" subtitle="% of teens affected — has increased since 2018">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={hbsc.cyberbullying_trend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0EDE8" />
            <XAxis dataKey="year" tick={{ fill: '#8B8680', fontSize: 12 }} />
            <YAxis tick={{ fill: '#8B8680', fontSize: 12 }} unit="%" />
            <Tooltip {...TT} />
            <Legend />
            <Line type="monotone" dataKey="victims"      stroke="#EF4444" strokeWidth={2} dot={{ fill: '#EF4444' }} />
            <Line type="monotone" dataKey="perpetrators" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
          </LineChart>
        </ResponsiveContainer>
      </Section>

      <Section title="Substance Use at Age 15">
        <div className="space-y-4">
          {hbsc.substance_use_summary.map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-dark">{item.label}</span>
                <span className="font-bold text-dark">{item.percentage}%</span>
              </div>
              <div className="h-2.5 bg-bg rounded-full overflow-hidden border border-border">
                <div className="h-full rounded-full"
                  style={{ width: `${item.percentage}%`, backgroundColor: ['#3B82F6','#60A5FA','#F97316','#FB923C'][i] }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <p className="text-xs text-muted text-center mt-2 mb-4">
        Source: WHO/HBSC International Report 2021/22
      </p>
    </div>
  )
}

// ── Main export — picks the right view based on role ─────────────────────────
export default function Stats() {
  const { user } = useAuth()
  const [hbsc, setHbsc] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    statsAPI.hbsc().then(r => setHbsc(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center text-muted pt-20">Loading...</div>

  if (user?.role === 'school') return <SchoolStats hbsc={hbsc} />
  return <StudentStats hbsc={hbsc} />
}