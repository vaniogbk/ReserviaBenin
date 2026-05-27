import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { hostApi } from '../../services/api'
import HostLayout from '../../components/layout/HostLayout'
import {
  FaBuilding, FaStar, FaMapMarkerAlt, FaBed, FaEye,
} from 'react-icons/fa'

export default function HebergementsHost() {
  const { data, isLoading } = useQuery({
    queryKey: ['host-hebergements'],
    queryFn:  () => hostApi.hebergements(),
  })

  const hebergements = data?.data || []

  return (
    <HostLayout title="Mes hébergements">

      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : hebergements.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FaBuilding size={36} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-display text-xl">Aucun hébergement</p>
          <p className="text-gray-400/60 text-sm mt-1">
            Vos hébergements apparaîtront ici une fois ajoutés par l'équipe Réservia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {hebergements.map(h => (
            <div key={h.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              {h.image_principale ? (
                <img src={h.image_principale} alt={h.nom}
                  className="w-full h-40 object-cover" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center">
                  <FaBuilding className="text-gray-300" size={32} />
                </div>
              )}
              <div className="p-5">
                <h3 className="font-semibold text-dark text-base mb-1 truncate">{h.nom}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} /> {h.ville}</span>
                  {h.note_moyenne > 0 && (
                    <span className="flex items-center gap-1"><FaStar size={10} className="text-amber-400" /> {h.note_moyenne}</span>
                  )}
                  <span className="flex items-center gap-1"><FaBed size={10} /> {h.nb_chambres ?? 0} chambre{h.nb_chambres !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                    h.statut === 'actif' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {h.statut === 'actif' ? 'Actif' : 'Inactif'}
                  </span>
                  <Link to={`/hebergements/${h.id}`}
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
