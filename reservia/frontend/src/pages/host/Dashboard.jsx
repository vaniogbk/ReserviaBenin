import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { hostApi } from '../../services/api'
import HostLayout from '../../components/layout/HostLayout'
import {
  FaBuilding, FaTicketAlt, FaClipboardList, FaMoneyBillWave,
  FaArrowRight, FaPlus,
} from 'react-icons/fa'

export default function HostDashboard() {
  const { user } = useAuth()

  const { data, isLoading } = useQuery({
    queryKey: ['host-stats'],
    queryFn:  () => hostApi.stats(),
  })

  const stats = data?.data || {}

  const isHebergement = user?.type_activite === 'hebergement'
  const isEvenement   = user?.type_activite === 'evenement'

  const cards = [
    isHebergement && {
      label: 'Hébergements',
      value: stats.hebergements ?? '—',
      icon: FaBuilding,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/host/hebergements',
    },
    isEvenement && {
      label: 'Événements',
      value: stats.evenements ?? '—',
      icon: FaTicketAlt,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
      link: '/host/evenements',
    },
    {
      label: 'Réservations',
      value: stats.total_reservations ?? '—',
      icon: FaClipboardList,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      link: '/host/reservations',
    },
    {
      label: 'Revenus (FCFA)',
      value: stats.revenus_total ? Number(stats.revenus_total).toLocaleString('fr-FR') : '—',
      icon: FaMoneyBillWave,
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
  ].filter(Boolean)

  return (
    <HostLayout title="Tableau de bord">

      {/* ── Bienvenue ── */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-dark">
          Bonjour, {user?.prenom}
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Voici un aperçu de votre activité sur Réservia Bénin.
        </p>
      </div>

      {/* ── Statistiques ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {cards.map(({ label, value, icon: Icon, color, bg, link }) => (
            <div key={label} className={`${bg} rounded-2xl px-6 py-5 flex items-center gap-4`}>
              <Icon className={color} size={22} />
              <div>
                <div className={`text-2xl font-display font-semibold ${color}`}>{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
              {link && (
                <Link to={link} className="ml-auto text-gray-400 hover:text-gray-600">
                  <FaArrowRight size={12} />
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Actions rapides ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-semibold text-dark mb-4">Actions rapides</h3>
        <div className="flex flex-wrap gap-3">
          {isHebergement && (
            <Link to="/host/hebergements"
              className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta/90 transition-colors">
              <FaPlus size={12} /> Gérer mes hébergements
            </Link>
          )}
          {isEvenement && (
            <Link to="/host/evenements"
              className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-terracotta/90 transition-colors">
              <FaPlus size={12} /> Gérer mes événements
            </Link>
          )}
          <Link to="/host/reservations"
            className="flex items-center gap-2 px-5 py-2.5 bg-dark text-white rounded-xl text-sm font-medium hover:bg-dark/90 transition-colors">
            <FaClipboardList size={12} /> Voir les réservations
          </Link>
        </div>
      </div>
    </HostLayout>
  )
}
