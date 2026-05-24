import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { MessageCircle, Flag, BarChart2, BookOpen, Home, BookMarked, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const STUDENT_NAV = [
  { to: '/',          label: 'Home',    Icon: Home },
  { to: '/report',    label: 'Report',  Icon: Flag },
  { to: '/stats',     label: 'Stats',   Icon: BarChart2 },
  { to: '/awareness', label: 'Learn',   Icon: BookOpen },
  { to: '/journal',   label: 'Journal', Icon: BookMarked },
  { to: '/chat',      label: 'Talk',    Icon: MessageCircle },
]

const SCHOOL_NAV = [
  { to: '/',           label: 'Home',      Icon: Home },
  { to: '/dashboard',  label: 'Reports',   Icon: LayoutDashboard },
  { to: '/stats',      label: 'Analytics', Icon: BarChart2 },
  { to: '/awareness',  label: 'Learn',     Icon: BookOpen },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const navItems = user?.role === 'school' ? SCHOOL_NAV : STUDENT_NAV

  return (
    <div className="min-h-screen flex flex-col bg-bg">
      {/* ── Top navbar ── */}
      <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="w-full px-6 h-14 grid grid-cols-3 items-center">

          {/* Left — logo */}
          <span className="font-display text-xl font-bold text-primary tracking-tight">
            RealTalk
          </span>

          {/* Center — nav */}
          <nav className="hidden md:flex items-center justify-center gap-1">
            {navItems.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
                   ${isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:text-dark hover:bg-gray-100'}`
                }
              >
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right — auth */}
          <div className="flex items-center justify-end gap-2">
            {user ? (
              <>
                <span className="text-xs text-muted hidden sm:flex items-center gap-1">
                  <User size={12} />
                  {user.full_name || user.username}
                </span>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="flex items-center gap-1 text-xs text-muted hover:text-primary transition px-2 py-1 rounded-lg hover:bg-primary/10"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </>
            ) : (
              <NavLink to="/login" className="text-sm font-medium text-primary hover:underline">
                Login
              </NavLink>
            )}
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden bg-white border-t border-border flex justify-around py-2 sticky bottom-0 z-50">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg text-xs transition-colors
               ${isActive ? 'text-primary' : 'text-muted hover:text-dark'}`
            }
          >
            <Icon size={19} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}