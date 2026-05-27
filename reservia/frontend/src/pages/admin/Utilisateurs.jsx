import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaUsers, FaUserShield, FaUserTie, FaUser,
  FaEnvelope, FaPhone, FaFilter,
} from 'react-icons/fa'

const ROLE_CONFIG = {
  client:      { label: 'Client',      color: 'bg-blue-100 text-blue-700',    icon: FaUser      },
  host:        { label: 'Hôte',        color: 'bg-amber-100 text-amber-700',  icon: FaUserTie   },
  prestataire: { label: 'Prestataire', color: 'bg-orange-100 text-orange-700',icon: FaUserTie   },
  admin:       { label: 'Admin',       color: 'bg-purple-100 text-purple-700', icon: FaUserShield},
}

export default function AdminUtilisateurs() {
  const qc = useQueryClient()
  const [filtreRole, setFiltreRole] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', filtreRole],
    queryFn:  () => adminApi.utilisateurs(filtreRole ? { role: filtreRole } : {}),
  })
  const utilisateurs = data?.data?.data || []
  const total        = data?.data?.total || 0

  const roleMutation = useMutation({
    mutationFn: ({ id, role }) => adminApi.updateRole(id, role),
    onSuccess:  () => { toast.success('Rôle mis à jour'); qc.invalidateQueries(['admin-users']) },
    onError:    () => toast.error('Erreur'),
  })

  return (
    <AdminLayout title="Utilisateurs">

      {/* ── Filtres ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-3 flex-wrap">
        <FaFilter size={13} className="text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">Filtrer :</span>
        {[['', 'Tous'], ['client', 'Clients'], ['host', 'Hôtes'], ['admin', 'Admins']].map(([v, l]) => (
          <button key={v} onClick={() => setFiltreRole(v)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filtreRole === v
                ? 'bg-dark text-white border-dark'
                : 'bg-white text-earth border-earth/30 hover:border-dark/40'
            }`}>
            {l}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{total} utilisateur{total > 1 ? 's' : ''}</span>
      </div>

      {/* ── Tableau ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : utilisateurs.length === 0 ? (
          <div className="text-center py-20">
            <FaUsers size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-display text-xl">Aucun utilisateur</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  {['Utilisateur', 'Contact', 'Rôle', 'Réservations', 'Inscrit le', 'Modifier rôle'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {utilisateurs.map(u => {
                  const r    = ROLE_CONFIG[u.role] || ROLE_CONFIG.client
                  const Icon = r.icon
                  return (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {u.prenom?.[0]}{u.nom?.[0]}
                          </div>
                          <div>
                            <div className="font-medium text-dark">{u.prenom} {u.nom}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1 text-xs text-gray-500 mb-0.5">
                          <FaEnvelope size={10} /> {u.email}
                        </div>
                        {u.telephone && (
                          <div className="flex items-center gap-1 text-xs text-gray-400">
                            <FaPhone size={10} /> {u.telephone}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${r.color}`}>
                          <Icon size={10} /> {r.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center font-semibold text-dark">{u.reservations_count ?? 0}</td>
                      <td className="px-5 py-4 text-gray-400 text-xs">
                        {format(new Date(u.created_at), 'dd/MM/yyyy', { locale: fr })}
                      </td>
                      <td className="px-5 py-4">
                        <select
                          value={u.role}
                          onChange={e => roleMutation.mutate({ id: u.id, role: e.target.value })}
                          className="text-xs border border-gray-200 rounded-xl px-3 py-1.5 outline-none focus:border-dark transition-colors cursor-pointer bg-white">
                          <option value="client">Client</option>
                          <option value="host">Hôte</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
