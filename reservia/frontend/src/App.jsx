import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import React from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Home from './pages/Home'
import Hebergements from './pages/Hebergements'
import HebergementDetail from './pages/HebergementDetail'
import Evenements from './pages/Evenements'
import EvenementDetail from './pages/EvenementDetail'
import Reservation from './pages/Reservation'
import Confirmation from './pages/Confirmation'
import Profil from './pages/Profil'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Dashboard from './pages/admin/Dashboard'
import AdminReservations from './pages/admin/Reservations'
import AdminHebergements from './pages/admin/Hebergements'
import AdminEvenements from './pages/admin/Evenements'
import AdminUtilisateurs from './pages/admin/Utilisateurs'

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
          <div className="bg-white rounded-lg p-8 max-w-md shadow-lg">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Oups ! Une erreur s'est produite</h1>
            <p className="text-gray-600 mb-6">Une erreur inattendue s'est produite. Veuillez recharger la page.</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition"
            >
              Recharger la page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" /></div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />
  return children
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/hebergements" element={<Hebergements />} />
                <Route path="/hebergements/:id" element={<HebergementDetail />} />
                <Route path="/evenements" element={<Evenements />} />
                <Route path="/evenements/:id" element={<EvenementDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/reservation/:type/:id" element={<ProtectedRoute><Reservation /></ProtectedRoute>} />
                <Route path="/confirmation/:ref" element={<ProtectedRoute><Confirmation /></ProtectedRoute>} />
                <Route path="/profil" element={<ProtectedRoute><Profil /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
                <Route path="/admin/reservations" element={<ProtectedRoute adminOnly><AdminReservations /></ProtectedRoute>} />
                <Route path="/admin/hebergements" element={<ProtectedRoute adminOnly><AdminHebergements /></ProtectedRoute>} />
                <Route path="/admin/evenements" element={<ProtectedRoute adminOnly><AdminEvenements /></ProtectedRoute>} />
                <Route path="/admin/utilisateurs" element={<ProtectedRoute adminOnly><AdminUtilisateurs /></ProtectedRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}
