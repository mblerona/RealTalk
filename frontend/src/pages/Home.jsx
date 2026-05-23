import { useNavigate } from 'react-router-dom'
import { Flag, BarChart2, BookOpen, BookMarked, MessageCircle, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const CARDS = [
  { to: '/report',    Icon: Flag,          label: 'Report an Incident', desc: '100% anonymous — no account needed', color: 'bg-primary', light: 'bg-red-50 text-primary' },
  { to: '/stats',     Icon: BarChart2,     label: 'See the Data',       desc: 'Real WHO/HBSC research stats',       color: 'bg-secondary', light: 'bg-blue-50 text-secondary' },
  { to: '/awareness', Icon: BookOpen,      label: 'Learn the Facts',    desc: 'About vaping, smoking & violence',   color: 'bg-accent', light: 'bg-green-50 text-accent' },
  { to: '/journal',   Icon: BookMarked,    label: 'Daily Check-in',     desc: 'Track your mood privately',          color: 'bg-amber-500', light: 'bg-amber-50 text-amber-600' },
]

const HIGHLIGHTS = [
  { value: '32%', label: 'of 15-year-olds have vaped', color: 'text-primary' },
  { value: '10%', label: 'of teens in physical fights', color: 'text-secondary' },
  { value: '16%', label: 'cyberbullying victims', color: 'text-accent' },
]

export default function Home() {
  const navigate = useNavigate()
  const { user } = useAuth()

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="pt-2">
        <p className="text-sm font-medium text-primary uppercase tracking-widest mb-2">RealTalk</p>
        <h1 className="font-display text-4xl font-bold text-dark leading-tight mb-3">
          {user ? `Welcome back,\n${user.username}` : 'Speak up.\nStay safe.'}
        </h1>
        <p className="text-muted text-base max-w-sm">
          A safe, anonymous space for students to report incidents and find support.
        </p>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-3">
        {HIGHLIGHTS.map(({ value, label, color }) => (
          <div key={label} className="bg-white rounded-2xl p-3 shadow-card border border-border text-center">
            <div className={`font-display text-2xl font-bold ${color}`}>{value}</div>
            <div className="text-xs text-muted mt-0.5 leading-tight">{label}</div>
          </div>
        ))}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-2 gap-3">
        {CARDS.map(({ to, Icon, label, desc, light }) => (
          <button
            key={to}
            onClick={() => navigate(to)}
            className="bg-white rounded-2xl p-4 text-left shadow-card border border-border hover:shadow-hover hover:-translate-y-0.5 transition-all group"
          >
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${light}`}>
              <Icon size={17} />
            </div>
            <div className="font-semibold text-sm text-dark">{label}</div>
            <div className="text-xs text-muted mt-0.5 leading-snug">{desc}</div>
          </button>
        ))}
      </div>

      {/* Quick report CTA */}
      <button
        onClick={() => navigate('/report')}
        className="w-full bg-primary text-white rounded-2xl p-4 flex items-center justify-between group hover:bg-red-600 transition-colors shadow-card"
      >
        <div>
          <div className="font-display font-semibold text-lg">Something happening at school?</div>
          <div className="text-red-200 text-sm mt-0.5">Report it anonymously — no account needed</div>
        </div>
        <ArrowRight size={20} className="shrink-0 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  )
}
