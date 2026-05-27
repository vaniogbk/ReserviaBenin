import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { evenementApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaTicketAlt, FaDrum, FaUtensils, FaTheaterMasks,
  FaBriefcase, FaPaw, FaPalette, FaMapMarkerAlt,
  FaUsers, FaCalendarAlt, FaTrash,
} from 'react-icons/fa'

const CAT_CONFIG = {
  vodoun:       { icon: FaDrum,         color: 'text-red-500',    bg: 'bg-red-50'    },
  gastronomie:  { icon: FaUtensils,     color: 'text-orange-500', bg: 'bg-orange-50' },
  culture:      { icon: FaTheaterMasks, color: 'text-purple-500', bg: 'bg-purple-50' },
  seminaire:    { icon: FaBriefcase,    color: 'text-blue-500',   bg: 'bg-blue-50'   },
  nature:       { icon: FaPaw,          color: 'text-green-500',  bg: 'bg-green-50'  },
  art:          { icon: FaPalette,      color: 'text-pink-500',   bg: 'bg-pink-50'   },
}

export default function AdminEvenements() {
  const qc = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['evenements-admin'],
    queryFn:  () => evenementApi.liste({ per_page: 50 }),
  })
  const evenements = data?.data?.data || []

  const deleteMutation = useMutation({
    mutationFn: evenementApi.supprimer,
    onSuccess:  () => { toast.success('Événement supprimé'); qc.invalidateQueries(['evenements-admin']) },
    onError:    () => toast.error('Erreur lors de la suppression'),
  })

  return (
    <AdminLayout title="Événements">

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <span className="text-sm text-gray-500">{evenements.length} événement{evenements.length !== 1 ? 's' : ''}</span>
        </div>

        {isLoading ? (
          <div className="p-8 space-y-3">
            {[1,2,3,4].map(i => <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />)}
          </div>
        ) : evenements.length === 0 ? (
          <div className="text-center py-20">
            <FaTicketAlt size={36} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-display text-xl">Aucun événement</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                <tr>
                  {['Événement', 'Catégorie', 'Ville', 'Date', 'Prix', 'Places', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {evenements.map(e => {
                  const cfg  = CAT_CONFIG[e.categorie] || { icon: FaTicketAlt, color: 'text-gray-400', bg: 'bg-gray-50' }
                  const Icon = cfg.icon
                  return (
                    <tr key={e.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                      <td className="px-5 py-4 font-medium text-dark max-w-[200px] truncate">{e.nom}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                            <Icon size={12} className={cfg.color} />
                          </div>
                          <span className="text-xs text-gray-500 capitalize">{e.categorie}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-gray-600 text-xs">
                          <FaMapMarkerAlt size={10} /> {e.ville}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-gray-400 text-xs">
                          <FaCalendarAlt size={10} />
                          {format(new Date(e.date_debut), 'dd MMM yyyy', { locale: fr })}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold text-dark">{e.prix_fcfa?.toLocaleString('fr-FR')} F</td>
                      <td className="px-5 py-4">
                        <span className="flex items-center gap-1 text-xs">
                          <FaUsers size={10} className="text-gray-400" />
                          <span className="text-green-600 font-semibold">{e.places_restantes}</span>
                          <span className="text-gray-400">/ {e.capacite_totale}</span>
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => { if (confirm('Supprimer cet événement ?')) deleteMutation.mutate(e.id) }}
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
