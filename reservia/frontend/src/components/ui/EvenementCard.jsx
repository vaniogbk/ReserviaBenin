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
  'marché':     FaUtensils,
  'conférence': FaBriefcase,
}

// Solid colours so Tailwind JIT always includes them
const CAT_COLOR = {
  festival:     '#C4603A',
  national:     '#166534',
  gastronomie:  '#92400e',
  carnival:     '#6b21a8',
  'conférence': '#1e40af',
  culture:      '#0f766e',
}

export default function EvenementCard({ item }) {
  const date = new Date(item.date_debut)
  const CatIcon = CATEGORIE_ICON[item.categorie] || FaTicketAlt
  const catColor = CAT_COLOR[item.categorie] || '#1E1810'
  const estGratuit = parseFloat(item.prix_entree || 0) === 0
  const estNational = item.categorie === 'national'
  const aLiveDirect = estNational || (estGratuit && item.type === 'hybride')

  return (
    <Link
      to={`/evenements/${item.id}`}
      className="card group flex flex-col overflow-hidden hover:-translate-y-1 transition-all duration-300"
    >
      {/* ── Image header ── */}
      <div className="relative h-48 overflow-hidden flex-shrink-0">

        {/* Gradient background — always visible as fallback */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${catColor}dd, #1E1810)` }}
        >
          <CatIcon style={{ color: 'rgba(255,255,255,0.15)', width: 72, height: 72 }} />
        </div>

        {/* Photo — absolutely positioned on top, hides on error */}
        {item.image_principale_url ? (
          <img
            src={item.image_principale_url}
            alt={item.titre}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => { e.currentTarget.style.display = 'none' }}
          />
        ) : null}

        {/* Dark vignette for readability of overlaid elements */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

        {/* Date badge */}
        <div className="absolute top-3 right-3 bg-terracotta text-white rounded-xl px-3 py-2 text-center shadow-lg z-10">
          <div className="font-display text-2xl font-light leading-none">{format(date, 'd')}</div>
          <div className="text-xs tracking-widest uppercase opacity-90">{format(date, 'MMM', { locale: fr })}</div>
        </div>

        {/* Badges top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {estGratuit && (
            <span className="bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg shadow">
              GRATUIT
            </span>
          )}
          {estNational && (
            <span className="bg-black/60 backdrop-blur text-yellow-300 text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
              <FaFlag size={9} /> National
            </span>
          )}
          {aLiveDirect && (
            <span className="bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow">
              <FaPlayCircle size={9} /> LIVE
            </span>
          )}
        </div>
      </div>

      {/* ── Text content ── */}
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

      {/* ── Footer ── */}
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
          {(item.nombre_places_disponibles || 0).toLocaleString('fr-FR')} places
        </span>
      </div>
    </Link>
  )
}
