import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Chat from './pages/Chat'
import Report from './pages/Report'
import Stats from './pages/Stats'
import Awareness from './pages/Awareness'
import Journal from './pages/Journal'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center min-h-screen text-muted">Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chat" element={<Chat />} />
        <Route path="report" element={<Report />} />
        <Route path="stats" element={<Stats />} />
        <Route path="awareness" element={<Awareness />} />
        <Route path="journal" element={<RequireAuth><Journal /></RequireAuth>} />
        <Route path="dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
      </Route>
    </Routes>
  )
}
