import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const chatAPI    = { send: (messages) => api.post('/api/chat/', { messages }) }
export const reportsAPI = {
  submit:       (data)         => api.post('/api/reports/', data),
  mySchool:     ()             => api.get('/api/reports/my-school'),
  updateStatus: (id, status)   => api.patch(`/api/reports/${id}/status`, { status }),
}
export const statsAPI   = {
  hbsc:    () => api.get('/api/stats/hbsc'),
  summary: () => api.get('/api/stats/reports/summary'),
  school:  () => api.get('/api/stats/school'),
}
export const authAPI    = {
  login:    (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
  me:       ()     => api.get('/api/auth/me'),
}
export const journalAPI = {
  create: (data) => api.post('/api/journal/', data),
  list:   ()     => api.get('/api/journal/'),
}
export const schoolsAPI = {
  list: () => api.get('/api/schools/'),
}

export default api