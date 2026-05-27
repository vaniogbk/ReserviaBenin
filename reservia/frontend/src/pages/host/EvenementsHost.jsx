import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { hostApi } from '../../services/api'
import HostLayout from '../../components/layout/HostLayout'
import {
  FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaUsers, FaEye, FaPlus,
} from 'react-icons/fa'

export default function EvenementsHost() {
  const { data, isLoading } = useQuery({
    queryKey: ['host-evenements'],
    queryFn:  () => hostApi.evenements(),
  })

  const evenements = data?.data || []

  return (
    <HostLayout title="Mes événements">

      <div className="flex justify-end mb-6">
        <Link to="/host/evenements/ajouter"
          className="flex items-center gap-2 px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-semibold hover:bg-terracotta/90 transition-colors">
          <FaPlus size={12} /> Ajouter un événement
        </Link>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : evenements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FaTicketAlt size={36} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-display text-xl">Aucun événement</p>
          <p className="text-gray-400/60 text-sm mt-1">
            Vos événements apparaîtront ici une fois ajoutés par l'équipe Réservia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {evenements.map(e => (
            <div key={e.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {e.image_principale ? (
                <img src={e.image_principale} alt={e.nom}
                  className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-purple-50 flex items-center justify-center">
                  <FaTicketAlt className="text-purple-200" size={32} />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-dark text-base mb-1 truncate">{e.nom}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3 flex-wrap">
                  <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} /> {e.lieu}</span>
                  {e.date_debut && (
                    <span className="flex items-center gap-1">
                      <FaCalendarAlt size={10} />
                      {new Date(e.date_debut).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                  {e.capacite && (
                    <span className="flex items-center gap-1"><FaUsers size={10} /> {e.capacite} places</span>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    e.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {e.statut === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                  <Link to={`/evenements/${e.id}`}
                    className="flex items-center gap-1.5 text-xs text-terracotta font-medium hover:underline">
                    <FaEye size={11} /> Voir la page
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </HostLayout>
  )
}
