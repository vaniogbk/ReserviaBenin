import { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

// Simple JWT decode pour vérifier l'expiration (sans dépendances)
function decodeToken(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('reservia_token')
    if (token) {
      // Vérifier si le token est expiré
      const decoded = decodeToken(token)
      if (decoded && decoded.exp) {
        const isExpired = decoded.exp < Math.floor(Date.now() / 1000)
        if (isExpired) {
          localStorage.removeItem('reservia_token')
          setLoading(false)
          return
        }
      }

      authApi.me()
        .then(r => setUser(r.data))
        .catch(err => {
          if (err.response?.status === 401) {
            localStorage.removeItem('reservia_token')
          }
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const { data } = await authApi.login(credentials)
    localStorage.setItem('reservia_token', data.token)
    setUser(data.user)
    return data
  }

  const register = async (formData) => {
    const { data } = await authApi.register(formData)
    localStorage.setItem('reservia_token', data.token)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    await authApi.logout().catch(() => { })
    localStorage.removeItem('reservia_token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
