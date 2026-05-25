import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaHome, FaTicketAlt, FaCalendarAlt, FaClock,
  FaCheckCircle, FaTimesCircle, FaHourglassHalf,
  FaChevronRight, FaUser, FaEnvelope, FaShieldAlt,
  FaMapMarkerAlt, FaStar,
} from 'react-icons/fa'

const STATUT_CONFIG = {
  confirmée:   { label: 'Confirmée',   bg: 'bg-green-100',  text: 'text-green-700',  icon: FaCheckCircle,    dot: 'bg-green-500' },
  en_attente:  { label: 'En attente',  bg: 'bg-amber-100',  text: 'text-amber-700',  icon: FaHourglassHalf,  dot: 'bg-amber-500' },
  annulée:     { label: 'Annulée',     bg: 'bg-red-100',    text: 'text-red-700',    icon: FaTimesCircle,    dot: 'bg-red-500'   },
  terminée:    { label: 'Terminée',    bg: 'bg-gray-100',   text: 'text-gray-600',   icon: FaCheckCircle,    dot: 'bg-gray-400'  },
}

function StatutPill({ statut }) {
  const cfg = STATUT_CONFIG[statut] || STATUT_CONFIG.en_attente
  const Icon = cfg.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <Icon size={10} />
      {cfg.label}
    </span>
  )
}

function PaiementPill({ statut }) {
  if (statut === 'payé') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-200">
        <FaCheckCircle size={9} /> Payé
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-600 border border-amber-200">
      <FaHourglassHalf size={9} /> En attente
    </span>
  )
}

function ReservationCard({ r }) {
  const isHeberg = r.type === 'hebergement'
  const titre = isHeberg
    ? (r.hebergement?.titre || r.hebergement?.nom || 'Hébergement')
    : (r.evenement?.titre || 'Événement')
  const ville = isHeberg
    ? (r.hebergement?.ville || '')
    : (r.evenement?.ville || '')
  const image = isHeberg
    ? r.hebergement?.image_principale_url
    : r.evenement?.image_principale_url

  const dateLabel = (() => {
    if (isHeberg && r.date_debut && r.date_fin) {
      const debut = format(new Date(r.date_debut), 'dd MMM yyyy', { locale: fr })
      const fin   = format(new Date(r.date_fin),   'dd MMM yyyy', { locale: fr })
      const nuits = r.nombre_nuits || ''
      return `${debut} → ${fin}${nuits ? ` · ${nuits} nuit${nuits > 1 ? 's' : ''}` : ''}`
    }
    if (r.date_evenement) {
      return format(new Date(r.date_evenement), 'EEEE dd MMMM yyyy', { locale: fr })
    }
    if (r.date_debut) {
      return format(new Date(r.date_debut), 'dd MMM yyyy', { locale: fr })
    }
    return '—'
  })()

  const createdAt = r.created_at
    ? format(new Date(r.created_at), 'dd MMM yyyy', { locale: fr })
    : null

  return (
    <Link
      to={`/confirmation/${r.numero_reservation}`}
      className="group block bg-white rounded-2xl border border-earth/10 shadow-sm
        hover:shadow-md hover:border-earth/25 transition-all duration-200 overflow-hidden"
    >
      <div className="flex items-stretch">

        {/* Thumbnail */}
        <div className="w-28 sm:w-36 flex-shrink-0 relative overflow-hidden bg-gradient-to-br from-dark/90 to-earth/60">
          {image ? (
            <img
              src={image}
              alt={titre}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={ev => { ev.currentTarget.style.display = 'none' }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              {isHeberg
                ? <FaHome className="text-white/40" size={28} />
                : <FaTicketAlt className="text-white/40" size={28} />}
            </div>
          )}
          {/* Type badge */}
          <div className="absolute top-2 left-2">
            <span className={`inline-flex items-center gap-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full
              ${isHeberg ? 'bg-terracotta' : 'bg-dark/80 backdrop-blur'}`}>
              {isHeberg ? <FaHome size={8} /> : <FaTicketAlt size={8} />}
              {isHeberg ? 'Séjour' : 'Événement'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <h3 className="font-semibold text-dark text-sm sm:text-base leading-snug line-clamp-2 group-hover:text-terracotta transition-colors">
                {titre}
              </h3>
              <FaChevronRight className="text-earth/40 group-hover:text-terracotta group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" size={13} />
            </div>
            {ville && (
              <p className="text-earth text-xs flex items-center gap-1 mb-2">
                <FaMapMarkerAlt size={9} /> {ville}
              </p>
            )}
            <p className="text-earth/70 text-xs flex items-center gap-1.5">
              <FaCalendarAlt size={9} className="flex-shrink-0" />
              <span className="truncate">{dateLabel}</span>
            </p>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-earth/10">
            <div className="flex items-center gap-2 flex-wrap">
              <StatutPill statut={r.statut} />
              <PaiementPill statut={r.statut_paiement} />
            </div>
            <div className="text-right">
              <div className="font-bold text-dark text-sm sm:text-base">
                {parseFloat(r.prix_total || 0).toLocaleString('fr-FR')}
                <span className="font-normal text-earth text-xs ml-1">FCFA</span>
              </div>
              {createdAt && (
                <div className="text-earth/50 text-[10px] mt-0.5 flex items-center gap-1 justify-end">
                  <FaClock size={8} /> {createdAt}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reference bar */}
      <div className="px-5 py-2 bg-sand/50 border-t border-earth/8 flex items-center justify-between">
        <span className="font-mono text-[11px] text-terracotta tracking-wide">{r.numero_reservation}</span>
        {r.statut === 'confirmée' && r.statut_paiement === 'payé' && (
          <span className="text-[10px] text-green-600 flex items-center gap-1">
            <FaStar size={8} /> Voir le reçu
          </span>
        )}
      </div>
    </Link>
  )
}

export default function Profil() {
  const { user } = useAuth()
  const { data, isLoading } = useQuery({
    queryKey: ['mes-reservations'],
    queryFn: reservationApi.mesList,
  })
  const reservations = data?.data?.data || []

  const stats = {
    total:     reservations.length,
    confirmee: reservations.filter(r => r.statut === 'confirmée').length,
    attente:   reservations.filter(r => r.statut === 'en_attente').length,
    depenses:  reservations
      .filter(r => r.statut_paiement === 'payé')
      .reduce((s, r) => s + parseFloat(r.prix_total || 0), 0),
  }

  return (
    <div className="pt-16 min-h-screen bg-gradient-to-b from-sand/40 to-white">
      <div className="max-w-4xl mx-auto px-4 py-10 sm:py-14">

        {/* ── Profile header ── */}
        <div className="bg-white rounded-3xl shadow-sm border border-earth/10 p-6 sm:p-8 mb-8 overflow-hidden relative">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-64 h-40 bg-gradient-to-bl from-terracotta/8 to-transparent rounded-bl-full pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-terracotta to-dark/80 text-white
                text-3xl font-bold flex items-center justify-center shadow-lg">
                {user?.prenom?.[0]?.toUpperCase()}{user?.nom?.[0]?.toUpperCase()}
              </div>
              {user?.role === 'admin' && (
                <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-terracotta rounded-lg
                  flex items-center justify-center shadow">
                  <FaShieldAlt className="text-white" size={12} />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl sm:text-3xl text-dark leading-tight">
                {user?.prenom} {user?.nom}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4 mt-1.5">
                <span className="text-earth text-sm flex items-center gap-1.5">
                  <FaEnvelope size={11} /> {user?.email}
                </span>
                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full self-start
                  ${user?.role === 'admin'
                    ? 'bg-terracotta/10 text-terracotta border border-terracotta/20'
                    : 'bg-earth/10 text-earth border border-earth/20'}`}>
                  <FaUser size={9} />
                  {user?.role === 'admin' ? 'Administrateur' : 'Membre'}
                </span>
              </div>
            </div>

            {/* Quick stats */}
            {!isLoading && stats.total > 0 && (
              <div className="hidden sm:flex items-center gap-4 text-center">
                <div>
                  <div className="font-display text-2xl text-dark">{stats.total}</div>
                  <div className="text-earth text-xs mt-0.5">Réservations</div>
                </div>
                <div className="w-px h-10 bg-earth/15" />
                <div>
                  <div className="font-display text-2xl text-green-600">{stats.confirmee}</div>
                  <div className="text-earth text-xs mt-0.5">Confirmées</div>
                </div>
                <div className="w-px h-10 bg-earth/15" />
                <div>
                  <div className="font-display text-xl text-dark">
                    {stats.depenses > 0
                      ? `${(stats.depenses / 1000).toFixed(0)}k`
                      : '0'}
                  </div>
                  <div className="text-earth text-xs mt-0.5">FCFA dépensés</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Section title ── */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-2xl text-dark">Mes Réservations</h2>
          {!isLoading && stats.attente > 0 && (
            <span className="text-sm text-amber-600 flex items-center gap-1.5">
              <FaHourglassHalf size={12} />
              {stats.attente} en attente de paiement
            </span>
          )}
        </div>

        {/* ── Content ── */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-28 animate-pulse border border-earth/10" />
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-earth/10 shadow-sm">
            <div className="w-20 h-20 bg-sand rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FaTicketAlt className="text-earth/40" size={32} />
            </div>
            <p className="font-display text-2xl text-dark mb-2">Aucune réservation</p>
            <p className="text-earth mb-8 max-w-sm mx-auto">
              Explorez nos hébergements et événements pour commencer votre aventure au Bénin.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link to="/hebergements"
                className="inline-flex items-center gap-2 bg-terracotta text-white px-6 py-3
                  rounded-xl font-semibold text-sm hover:bg-terracotta/90 transition-colors">
                <FaHome size={13} /> Hébergements
              </Link>
              <Link to="/evenements"
                className="inline-flex items-center gap-2 border-2 border-earth/25 text-dark px-6 py-3
                  rounded-xl font-semibold text-sm hover:border-dark transition-colors">
                <FaTicketAlt size={13} /> Événements
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {reservations.map(r => <ReservationCard key={r.id} r={r} />)}
          </div>
        )}
      </div>
    </div>
  )
}
