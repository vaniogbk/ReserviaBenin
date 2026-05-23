import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaMusic, FaUtensils, FaTicketAlt, FaBriefcase, FaLeaf, FaPalette,
  FaMapMarkerAlt, FaFlag, FaPlayCircle
} from 'react-icons/fa'

const CATEGORIE_ICON = {
  vodoun:       FaMusic,
  gastronomie:  FaUtensils,
  culture:      FaTicketAlt,
  seminaire:    FaBriefcase,
  nature:       FaLeaf,
  art:          FaPalette,
  festival:     FaMusic,
  carnival:     FaTicketAlt,
  national:     FaFlag,
  marché:       FaUtensils,
  'conférence': FaBriefcase,
}

const CAT_BG = {
  festival:     'from-terracotta/90 to-dark',
  national:     'from-green-800 to-dark',
  gastronomie:  'from-amber-700 to-dark',
  carnival:     'from-purple-700 to-dark',
  'conférence': 'from-blue-800 to-dark',
  culture:      'from-teal-700 to-dark',
  default:      'from-dark to-dark/80',
}

function catBg(cat) {
  return CAT_BG[cat] || CAT_BG.default
}

export default function EvenementCard({ item }) {
  const date = new Date(item.date_debut)
  const CatIcon = CATEGORIE_ICON[item.categorie] || FaTicketAlt
  const estGratuit = parseFloat(item.prix_entree || 0) === 0
  const estNational = item.categorie === 'national'
  const aLiveDirect = estNational || (estGratuit && item.type === 'hybride')

  return (
    <Link to={`/evenements/${item.id}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300">

      {/* Image / header */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">
        {item.image_principale_url ? (
          <img
            src={item.image_principale_url}
            alt={item.titre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={e => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'flex' }}
          />
        ) : null}
        {/* Fallback gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br ${catBg(item.categorie)} flex items-center justify-center
          ${item.image_principale_url ? 'hidden' : 'flex'}`}
          style={{ display: item.image_principale_url ? 'none' : 'flex' }}>
          <CatIcon className="text-white/20" size={72} />
        </div>

        {/* Overlay gradient for readability */}
        {item.image_principale_url && (
          <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent" />
        )}

        {/* Date badge */}
        <div className="absolute top-3 right-3 bg-terracotta text-white rounded-xl px-3 py-2 text-center shadow-lg">
          <div className="font-display text-2xl font-light leading-none">{format(date, 'd')}</div>
          <div className="text-xs tracking-widest uppercase opacity-90">{format(date, 'MMM', { locale: fr })}</div>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {estGratuit && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
              GRATUIT
            </span>
          )}
          {estNational && (
            <span className="bg-dark/80 backdrop-blur text-earth text-xs font-semibold px-2.5 py-1 rounded-lg
              flex items-center gap-1 shadow border border-earth/20">
              <FaFlag size={9} /> National
            </span>
          )}
          {aLiveDirect && (
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg
              flex items-center gap-1 shadow animate-pulse">
              <FaPlayCircle size={9} /> LIVE
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-start gap-2 mb-2">
          <span className="p-1.5 rounded-lg bg-sand flex-shrink-0 mt-0.5">
            <CatIcon className="text-earth" size={12} />
          </span>
          <h3 className="font-display text-lg text-dark leading-tight group-hover:text-terracotta transition-colors">
            {item.titre}
          </h3>
        </div>
        <p className="text-xs text-earth mb-3 flex items-center gap-1.5">
          <FaMapMarkerAlt size={10} className="flex-shrink-0" />
          {item.lieu}, {item.ville}
        </p>
        <p className="text-sm text-dark/60 line-clamp-2 flex-1">{item.description}</p>
      </div>

      {/* Footer */}
      <div className="px-5 py-3.5 border-t border-earth/15 bg-sand/40 flex items-center justify-between">
        <div>
          {estGratuit ? (
            <span className="font-bold text-green-600 text-sm">Entrée gratuite</span>
          ) : (
            <>
              <span className="font-semibold text-dark text-sm">
                {parseFloat(item.prix_entree || 0).toLocaleString('fr-FR')} FCFA
              </span>
              <span className="text-xs text-earth"> / pers.</span>
            </>
          )}
        </div>
        <span className="text-xs text-earth bg-white px-2.5 py-1 rounded-full border border-earth/15">
          {item.nombre_places_disponibles?.toLocaleString('fr-FR')} places
        </span>
      </div>
    </Link>
  )
}
