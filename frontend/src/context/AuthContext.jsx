import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      authAPI.me()
        .then(r => setUser(r.data))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (username, password) => {
    const r = await authAPI.login({ username, password })
    localStorage.setItem('token', r.data.access_token)
    setUser({ username: r.data.username, role: r.data.role })
    return r.data
  }

  const register = async (username, password, role, full_name, email) => {
    const r = await authAPI.register({ username, password, role, full_name, email })
    localStorage.setItem('token', r.data.access_token)
    setUser({ username: r.data.username, role: r.data.role, full_name: r.data.full_name })
    return r.data
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)