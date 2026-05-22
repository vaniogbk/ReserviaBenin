import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { hebergementApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { FaMapMarkerAlt, FaStar, FaCheck, FaLock, FaCheckCircle } from 'react-icons/fa'

const FALLBACK = {
  hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=85',
  ecolodge: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=85',
  gite: 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=1200&q=85',
  villa: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=85',
  auberge: 'https://images.unsplash.com/photo-1551016049-f7b05035c24e?w=1200&q=85',
  resort: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=85',
  appartement: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&q=85',
  maison: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=85',
}

function ChambreCard({ chambre, hebergementId, user }) {
  const [imgIdx, setImgIdx] = useState(0)
  const images = Array.isArray(chambre.images) ? chambre.images : []
  const amenagements = Array.isArray(chambre.amenagements) ? chambre.amenagements : []
  const img = images[imgIdx] || FALLBACK.hotel

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      {/* Galerie images */}
      <div className="relative h-52 bg-sand overflow-hidden">
        <img
          src={img}
          alt={chambre.nom}
          className="w-full h-full object-cover transition-opacity duration-300"
          onError={e => { e.target.src = FALLBACK.hotel }}
        />
        {images.length > 1 && (
          <>
            <button
              onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
            >‹</button>
            <button
              onClick={() => setImgIdx(i => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition-colors text-sm"
            >›</button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${i === imgIdx ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
        {chambre.surface_m2 && (
          <span className="absolute top-3 left-3 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            {chambre.surface_m2} m²
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-dark text-base leading-tight">{chambre.nom}</h3>
          <span className="text-xs text-earth ml-2 whitespace-nowrap">{chambre.capacite} pers.</span>
        </div>

        <p className="text-dark/60 text-sm leading-relaxed mb-3 line-clamp-2">{chambre.description}</p>

        {amenagements.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {amenagements.slice(0, 4).map(a => (
              <span key={a} className="text-xs bg-sand text-earth px-2 py-0.5 rounded-full">{a}</span>
            ))}
            {amenagements.length > 4 && (
              <span className="text-xs bg-sand text-earth px-2 py-0.5 rounded-full">+{amenagements.length - 4}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-sand">
          <div>
            <span className="font-display text-xl text-dark">
              {parseFloat(chambre.prix_par_nuit).toLocaleString('fr-FR')}
            </span>
            <span className="text-xs text-earth ml-1">FCFA/nuit</span>
          </div>
          {user ? (
            <Link
              to={`/reservation/hebergement/${hebergementId}?chambre=${chambre.id}`}
              className="btn-terracotta text-sm py-2 px-4"
            >
              Réserver
            </Link>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-4">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

export default function HebergementDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [heroImgError, setHeroImgError] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['hebergement', id],
    queryFn: () => hebergementApi.detail(id),
  })

  const { data: chambresData } = useQuery({
    queryKey: ['chambres', id],
    queryFn: () => hebergementApi.chambres(id),
    enabled: !!id,
  })

  const h = data?.data
  const chambres = chambresData?.data ?? []

  if (isLoading) return (
    <div className="pt-16 flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"/>
    </div>
  )
  if (!h) return null

  const imageUrl = (!heroImgError && h.image_principale_url) || FALLBACK[h.type] || FALLBACK.hotel
  const autresImages = Array.isArray(h.autres_images_urls) ? h.autres_images_urls : []
  const amenagements = Array.isArray(h.amenagements) ? h.amenagements : []
  const prix = parseFloat(h.prix_par_nuit)

  return (
    <div className="pt-16">
      {/* Hero image */}
      <div className="h-80 sm:h-[26rem] relative overflow-hidden bg-sand">
        <img
          src={imageUrl}
          alt={h.titre}
          className="w-full h-full object-cover"
          onError={() => setHeroImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"/>
        <div className="absolute bottom-6 left-8 flex gap-2">
          <span className="badge bg-white text-terracotta shadow-sm capitalize">{h.type}</span>
          <span className="badge bg-white text-earth shadow-sm flex items-center gap-1"><FaStar className="text-yellow-400" size={10} /> {h.note_moyenne}</span>
          <span className="badge bg-dark/70 text-white shadow-sm capitalize">{h.categorie}</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Infos */}
          <div className="lg:col-span-2">
            <p className="text-xs tracking-widest uppercase text-earth mb-2 flex items-center gap-1"><FaMapMarkerAlt size={10} /> {h.adresse}, {h.ville}</p>
            <h1 className="font-display text-4xl font-light text-dark mb-4">{h.titre}</h1>
            <p className="text-dark/70 leading-relaxed mb-6">{h.description}</p>

            {amenagements.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-dark mb-3">Équipements</h3>
                <div className="flex flex-wrap gap-2">
                  {amenagements.map(c => (
                    <span key={c} className="px-3 py-1.5 bg-sand rounded-full text-sm text-earth font-medium flex items-center gap-1"><FaCheck size={10} /> {c}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-4 bg-sand rounded-2xl p-5 mb-8">
              <div className="text-center">
                <div className="font-display text-2xl">{h.nombre_pieces}</div>
                <div className="text-xs text-earth mt-1">Chambres</div>
              </div>
              <div className="text-center border-x border-earth/20">
                <div className="font-display text-2xl">{h.capacite_max}</div>
                <div className="text-xs text-earth mt-1">Personnes max</div>
              </div>
              <div className="text-center">
                <div className="font-display text-2xl flex items-center justify-center gap-1"><FaStar className="text-yellow-400" size={16} />{h.note_moyenne}</div>
                <div className="text-xs text-earth mt-1">{h.nombre_avis} avis</div>
              </div>
            </div>

            {/* Galerie autres images */}
            {autresImages.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-dark mb-3">Galerie photos</h3>
                <div className="grid grid-cols-3 gap-2">
                  {autresImages.slice(0, 6).map((url, i) => (
                    <div key={i} className="aspect-video rounded-xl overflow-hidden bg-sand">
                      <img
                        src={url}
                        alt={`${h.titre} ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.style.display = 'none' }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking widget */}
          <div className="bg-white rounded-2xl shadow-xl p-6 h-fit sticky top-24">
            <div className="text-center mb-6">
              <div className="text-xs text-earth mb-1">À partir de</div>
              <div className="font-display text-3xl text-dark">
                {isNaN(prix) ? '—' : prix.toLocaleString('fr-FR')} FCFA
              </div>
              <div className="text-earth text-sm">par nuit</div>
            </div>
            {user ? (
              <Link to={`/reservation/hebergement/${h.id}`}
                className="btn-terracotta w-full justify-center text-base py-4">
                Réserver maintenant →
              </Link>
            ) : (
              <Link to="/login"
                className="btn-primary w-full justify-center text-base py-4">
                Connexion pour réserver
              </Link>
            )}
            <p className="text-center text-xs text-earth mt-4 flex items-center justify-center gap-1"><FaLock size={10} /> Paiement sécurisé en FCFA</p>
            <p className="text-center text-xs text-earth mt-1 flex items-center justify-center gap-1"><FaCheckCircle size={10} className="text-green-500" /> Annulation possible avant 48h</p>

            {chambres.length > 0 && (
              <div className="mt-4 pt-4 border-t border-sand text-center text-xs text-earth">
                {chambres.length} type{chambres.length > 1 ? 's' : ''} de chambre{chambres.length > 1 ? 's' : ''} disponible{chambres.length > 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Section chambres & suites */}
        {chambres.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl font-light text-dark">
                Chambres & Suites
              </h2>
              <span className="text-sm text-earth">{chambres.length} option{chambres.length > 1 ? 's' : ''}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {chambres.map(chambre => (
                <ChambreCard
                  key={chambre.id}
                  chambre={chambre}
                  hebergementId={h.id}
                  user={user}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
