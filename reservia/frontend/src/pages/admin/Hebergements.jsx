import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminApi, hebergementApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'
import {
  FaBuilding, FaLeaf, FaHome, FaUmbrellaBeach, FaLandmark,
  FaStar, FaMapMarkerAlt, FaTrash, FaToggleOn, FaToggleOff,
} from 'react-icons/fa'

const TYPE_CONFIG = {
  hotel:    { icon: FaBuilding,      color: 'text-blue-500',   bg: 'bg-blue-50'   },
  ecolodge: { icon: FaLeaf,          color: 'text-green-500',  bg: 'bg-green-50'  },
  gite:     { icon: FaHome,          color: 'text-amber-500',  bg: 'bg-amber-50'  },
  villa:    { icon: FaUmbrellaBeach, color: 'text-cyan-500',   bg: 'bg-cyan-50'   },
  auberge:  { icon: FaLandmark,      color: 'text-purple-500', bg: 'bg-purple-50' },
}

export default function AdminHebergements() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['hebergements-admin'],
    queryFn:  () => hebergementApi.liste({ per_page: 50 }),
  })
  const hebergements = data?.data?.data || []

  const deleteMutation = useMutation({
    mutationFn: hebergementApi.supprimer,
    onSuccess:  () => { toast.success('Hébergement supprimé'); qc.invalidateQueries(['hebergements-admin']) },
    onError:    () => toast.error('Erreur lors de la suppression'),
  })

  const toggleMutation = useMutation({
    mutationFn: ({ id, actif }) => hebergementApi.modifier(id, { actif }),
    onSuccess:  () => { toast.success('Statut mis à jour'); qc.invalidateQueries(['hebergements-admin']) },
  })

  return (
    <AdminLayout title="Hébergements">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">{hebergements.length} hébergement{hebergements.length !== 1 ? 's' : ''}</span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : hebergements.length === 0 ? (
          <div className="text-center py-20">
            <FaBuilding size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-display text-xl">Aucun hébergement</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  {['Hébergement', 'Type', 'Ville', 'Prix / nuit', 'Note', 'Statut', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {hebergements.map(h => {
                  const cfg  = TYPE_CONFIG[h.type] || TYPE_CONFIG.hotel
                  const Icon = cfg.icon
                  return (
                    <tr key={h.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={14} className={cfg.color} />
                          </div>
                          <span className="font-medium text-dark">{h.nom}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 capitalize text-gray-500 text-xs">{h.type}</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-gray-600 text-xs">
                          <FaMapMarkerAlt size={10} /> {h.ville}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-dark">{h.prix_nuit_fcfa?.toLocaleString('fr-FR')} F</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-amber-500 font-semibold text-sm">
                          <FaStar size={11} /> {h.note_moyenne || '—'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => toggleMutation.mutate({ id: h.id, actif: !h.actif })}
                          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full transition-all ${
                            h.actif
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                          }`}>
                          {h.actif
                            ? <><FaToggleOn size={12} /> Actif</>
                            : <><FaToggleOff size={12} /> Inactif</>}
                        </button>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => { if (confirm('Supprimer cet hébergement ?')) deleteMutation.mutate(h.id) }}
                          className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 font-medium transition-colors px-2 py-1 rounded-lg hover:bg-red-50">
                          <FaTrash size={10} /> Supprimer
                        </button>
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
