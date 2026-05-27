import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import StatutBadge from '../../components/ui/StatutBadge'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { FaFilter, FaClipboardList } from 'react-icons/fa'

const FILTRES = [
  { value: '',           label: 'Toutes'     },
  { value: 'en_attente', label: 'En attente' },
  { value: 'confirmee',  label: 'Confirmées' },
  { value: 'annulee',    label: 'Annulées'   },
]

export default function AdminReservations() {
  const [statut, setStatut] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reservations', statut],
    queryFn:  () => adminApi.reservations({ statut }),
  })
  const reservations = data?.data?.data || []
  const total        = data?.data?.total || 0

  return (
    <AdminLayout title="Réservations">

      {/* ── Filtres ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-3 flex-wrap">
        <FaFilter size={13} className="text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">Filtrer :</span>
        {FILTRES.map(({ value, label }) => (
          <button key={value} onClick={() => setStatut(value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              statut === value
                ? 'bg-dark text-white border-dark'
                : 'bg-white text-earth border-earth/30 hover:border-dark/40'
            }`}>
            {label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{total} réservation{total > 1 ? 's' : ''}</span>
      </div>

      {/* ── Tableau ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-20">
            <FaClipboardList size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-display text-xl">Aucune réservation</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  {['Référence', 'Client', 'Prestation', 'Dates', 'Montant', 'Paiement', 'Statut'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reservations.map(r => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                    <td className="px-5 py-4 font-mono text-terracotta font-semibold text-xs">{r.reference}</td>
                    <td className="px-5 py-4">
                      <div className="font-medium text-dark">{r.user?.prenom} {r.user?.nom}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{r.user?.email}</div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 max-w-[140px] truncate">{r.reservable?.nom}</td>
                    <td className="px-5 py-4 text-gray-400 text-xs">
                      {r.date_arrivee
                        ? `${format(new Date(r.date_arrivee), 'dd/MM/yy', { locale: fr })} → ${format(new Date(r.date_depart), 'dd/MM/yy', { locale: fr })}`
                        : '—'}
                    </td>
                    <td className="px-5 py-4 font-semibold text-dark">{r.montant_total_fcfa?.toLocaleString('fr-FR')} F</td>
                    <td className="px-5 py-4 text-xs text-gray-500 capitalize">
                      {r.paiement?.methode?.replace('_', ' ') || '—'}
                    </td>
                    <td className="px-5 py-4"><StatutBadge statut={r.statut} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
