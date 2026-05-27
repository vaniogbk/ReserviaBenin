import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { hostApi } from '../../services/api'
import HostLayout from '../../components/layout/HostLayout'
import {
  FaClipboardList, FaBuilding, FaTicketAlt, FaUser,
  FaCalendarAlt, FaMoneyBillWave, FaFilter,
} from 'react-icons/fa'

const STATUT_COLOR = {
  confirmée:  'bg-green-100 text-green-700',
  en_attente: 'bg-amber-100 text-amber-700',
  annulée:    'bg-red-100 text-red-600',
}

export default function ReservationsHost() {
  const [filtreStatut, setFiltreStatut] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['host-reservations', filtreStatut],
    queryFn:  () => hostApi.reservations(filtreStatut ? { statut: filtreStatut } : {}),
  })

  const reservations = data?.data?.data || []
  const total        = data?.data?.total || 0

  return (
    <HostLayout title="Réservations">

      {/* ── Filtres ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-3 flex-wrap">
        <FaFilter size={13} className="text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">Filtrer :</span>
        {['', 'confirmée', 'en_attente', 'annulée'].map(s => (
          <button key={s} onClick={() => setFiltreStatut(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filtreStatut === s
                ? 'bg-dark text-white border-dark'
                : 'bg-white text-earth border-earth/30 hover:border-dark/40'
            }`}>
            {s === '' ? 'Toutes' : s.charAt(0).toUpperCase() + s.slice(1).replace('_', ' ')}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{total} réservation{total > 1 ? 's' : ''}</span>
      </div>

      {/* ── Liste ── */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FaClipboardList size={36} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-display text-xl">Aucune réservation</p>
          <p className="text-gray-400/60 text-sm mt-1">Les réservations pour vos établissements apparaîtront ici.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map(r => {
            const etablissement = r.hebergement || r.evenement
            const TypeIcon = r.hebergement ? FaBuilding : FaTicketAlt
            return (
              <div key={r.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <TypeIcon size={13} className="text-gray-400 flex-shrink-0" />
                      <h3 className="font-semibold text-dark text-sm truncate">
                        {etablissement?.nom || '—'}
                      </h3>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUT_COLOR[r.statut] || 'bg-gray-100 text-gray-500'}`}>
                        {r.statut?.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400 mt-1">
                      {r.user && (
                        <span className="flex items-center gap-1">
                          <FaUser size={10} /> {r.user.prenom} {r.user.nom}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <FaCalendarAlt size={10} />
                        {r.date_debut && new Date(r.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                        {r.date_fin && ` → ${new Date(r.date_fin).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}`}
                      </span>
                      <span className="flex items-center gap-1">
                        <FaMoneyBillWave size={10} />
                        {r.prix_total ? `${Number(r.prix_total).toLocaleString('fr-FR')} FCFA` : '—'}
                      </span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-300 flex-shrink-0">
                    #{r.reference}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </HostLayout>
  )
}
