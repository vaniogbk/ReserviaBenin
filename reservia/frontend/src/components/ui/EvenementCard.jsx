import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaMusic, FaUtensils, FaTicketAlt, FaBriefcase, FaLeaf, FaPalette, FaMapMarkerAlt
} from 'react-icons/fa'

const CATEGORIE_ICON = {
  vodoun:      FaMusic,
  gastronomie: FaUtensils,
  culture:     FaTicketAlt,
  seminaire:   FaBriefcase,
  nature:      FaLeaf,
  art:         FaPalette,
}
const BG = { vodoun: '#1E1810', gastronomie: '#3a2215', culture: '#1a2c1a', seminaire: '#1a1a2c', nature: '#1f2c1a', art: '#2c1a1a' }

export default function EvenementCard({ item }) {
  const date = new Date(item.date_debut)
  const CatIcon = CATEGORIE_ICON[item.categorie] || FaTicketAlt
  return (
    <Link to={`/evenements/${item.id}`} className="card group flex flex-col">
      <div className="flex items-center justify-between p-5"
           style={{ background: BG[item.categorie] || '#1E1810' }}>
        <span className="text-white/80"><CatIcon size={36} /></span>
        <div className="bg-terracotta text-white rounded-xl px-4 py-2 text-center">
          <div className="font-display text-2xl font-light leading-none">{format(date, 'd')}</div>
          <div className="text-xs tracking-widest uppercase opacity-80">{format(date, 'MMM', { locale: fr })}</div>
        </div>
      </div>
      <div className="p-5 flex-1">
        <h3 className="font-display text-xl text-dark mb-1 group-hover:text-primary transition-colors">
          {item.nom}
        </h3>
        <p className="text-xs text-earth mb-3 flex items-center gap-1"><FaMapMarkerAlt size={10} /> {item.lieu}, {item.ville}</p>
        <p className="text-sm text-dark/60 line-clamp-2">{item.description}</p>
      </div>
      <div className="px-5 py-3 border-t border-earth/20 flex items-center justify-between">
        <div>
          <span className="font-semibold text-dark">{item.prix_fcfa?.toLocaleString('fr-FR')} FCFA</span>
          <span className="text-xs text-earth"> / pers.</span>
        </div>
        <span className="text-xs text-earth">{item.places_restantes} places</span>
      </div>
    </Link>
  )
}
