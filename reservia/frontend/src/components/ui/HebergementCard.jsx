import { Link } from 'react-router-dom'
import { FaMapMarkerAlt, FaUsers, FaStar } from 'react-icons/fa'

const FALLBACK = {
  hotel:       'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
  resort:      'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
  villa:       'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80',
  appartement: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
  maison:      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
  ecolodge:    'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=800&q=80',
  gite:        'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=800&q=80',
  auberge:     'https://images.unsplash.com/photo-1551016049-f7b05035c24e?w=800&q=80',
}

export default function HebergementCard({ item }) {
  const imageUrl     = item.image_principale_url || FALLBACK[item.type] || FALLBACK.hotel
  const amenagements = Array.isArray(item.amenagements) ? item.amenagements : []
  const prix         = parseFloat(item.prix_par_nuit)

  return (
    <Link to={`/hebergements/${item.id}`} className="card group block">
      <div className="relative h-48 overflow-hidden rounded-t-2xl">
        <img
          src={imageUrl}
          alt={item.titre}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.src = FALLBACK.hotel }}
        />
        <div className="absolute top-3 left-3 badge bg-white text-dark shadow-sm flex items-center gap-1">
          <FaStar className="text-yellow-400" size={10} /> {item.note_moyenne}
        </div>
        <div className="absolute top-3 right-3 badge bg-dark/80 text-white text-xs capitalize">
          {item.type}
        </div>
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="p-4">
        <p className="text-xs tracking-widest uppercase text-earth mb-1 flex items-center gap-1">
          <FaMapMarkerAlt size={10} /> {item.ville}
        </p>
        <h3 className="font-display text-xl text-dark mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {item.titre}
        </h3>
        <div className="flex flex-wrap gap-1 mb-2">
          {amenagements.slice(0, 3).map(c => (
            <span key={c} className="px-2 py-0.5 bg-sand text-earth text-xs rounded-full">{c}</span>
          ))}
        </div>
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-earth/20">
          <div>
            <span className="font-semibold text-dark">{isNaN(prix) ? '—' : prix.toLocaleString('fr-FR')} FCFA</span>
            <span className="text-xs text-earth"> / nuit</span>
          </div>
          <span className="text-xs text-earth flex items-center gap-1">
            <FaUsers size={10} /> max {item.capacite_max}
          </span>
        </div>
      </div>
    </Link>
  )
}
