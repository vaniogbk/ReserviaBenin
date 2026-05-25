import axios from 'axios'

// Vérifier que l'URL API est configurée
const apiUrl = import.meta.env.VITE_API_URL
if (!apiUrl) {
  console.error('[FAIL] VITE_API_URL environment variable is not configured')
  throw new Error('VITE_API_URL must be defined in environment variables')
}

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Bypass-Tunnel-Reminder': 'true',
  },
})

// Injecter le token automatiquement
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('reservia_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Gérer les erreurs globalement
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('reservia_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ── Auth ──
export const authApi = {
  register:   (data) => api.post('/register', data),
  login:      (data) => api.post('/login', data),
  logout:     ()     => api.post('/logout'),
  me:         ()     => api.get('/user'),
  update:     (data) => api.put('/user', data),
  verifyOtp:  (data) => api.post('/email/verify-otp', data),
  resendOtp:  (data) => api.post('/email/resend-otp', data),
}

// ── Hébergements ──
export const hebergementApi = {
  liste: ({ amenagements = [], ...rest } = {}) => {
    const searchParams = new URLSearchParams()
    Object.entries(rest).forEach(([k, v]) => { if (v !== '' && v != null) searchParams.append(k, v) })
    amenagements.forEach(a => searchParams.append('amenagements[]', a))
    return api.get('/hebergements', { params: searchParams })
  },
  detail: (id) => api.get(`/hebergements/${id}`),
  chambres: (id) => api.get(`/hebergements/${id}/chambres`),
  disponibilites: (id) => api.get(`/hebergements/${id}/disponibilites`),
  creer: (data) => api.post('/hebergements', data),
  modifier: (id, d) => api.put(`/hebergements/${id}`, d),
  supprimer: (id) => api.delete(`/admin/hebergements/${id}`),
}

// ── Événements ──
export const evenementApi = {
  liste: (params) => api.get('/evenements', { params }),
  detail: (id) => api.get(`/evenements/${id}`),
  creer: (data) => api.post('/evenements', data),
  modifier: (id, d) => api.put(`/evenements/${id}`, d),
  supprimer: (id) => api.delete(`/admin/evenements/${id}`),
}

// ── Réservations ──
export const reservationApi = {
  mesList: () => api.get('/reservations'),
  detail: (ref) => api.get(`/reservations/${ref}`),
  creer: (data) => api.post('/reservations', data),
  annuler: (ref) => api.patch(`/reservations/${ref}/annuler`),
  recu: (ref) => api.get(`/reservations/${ref}/recu`, { responseType: 'blob' }),
}

// ── Paiements ──
export const paiementApi = {
  initier:   (data) => api.post('/paiements/initier', data),
  confirmer: (id, data) => api.post(`/paiements/${id}/confirmer`, data),
  statut:    (id) => api.get(`/paiements/${id}/statut`),
}

// ── Partenaires ──
export const partenaireApi = {
  candidature: (data) => api.post('/partenaires/candidature', data),
}

// ── Admin ──
export const adminApi = {
  dashboard: () => api.get('/admin/dashboard'),
  reservations: (params) => api.get('/admin/reservations', { params }),
  utilisateurs: (params) => api.get('/admin/utilisateurs', { params }),
  updateRole: (id, role) => api.patch(`/admin/utilisateurs/${id}/role`, { role }),
  statistiques: () => api.get('/admin/statistiques'),
}

export default api
