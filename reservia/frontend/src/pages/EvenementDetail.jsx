import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { evenementApi } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import {
  FaMusic, FaUtensils, FaTicketAlt, FaBriefcase, FaLeaf, FaPalette,
  FaMapMarkerAlt, FaLock, FaEnvelope, FaFlag, FaPlayCircle,
  FaYoutube, FaFacebook, FaGlobe, FaUsers, FaTimes
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

// Official live-stream channels for national Benin events
const CHAINES_DIRECT = [
  {
    id: 'ortb',
    label: 'ORTB (TV Nationale)',
    sousTitre: 'Chaîne officielle du gouvernement',
    icon: FaTimes,
    iconComp: ({ size }) => (
      <span className="font-bold text-xs text-white bg-green-700 rounded px-1.5 py-0.5">ORTB</span>
    ),
    url: 'https://www.ortb.bj',
    color: 'bg-green-700',
  },
  {
    id: 'youtube_ortb',
    label: 'YouTube ORTB',
    sousTitre: 'Retransmission officielle en direct',
    icon: FaYoutube,
    iconComp: null,
    url: 'https://www.youtube.com/@ortbofficiel',
    color: 'bg-red-600',
  },
  {
    id: 'facebook_ortb',
    label: 'Facebook ORTB',
    sousTitre: 'Live sur la page officielle',
    icon: FaFacebook,
    iconComp: null,
    url: 'https://www.facebook.com/ORTB.officiel',
    color: 'bg-blue-600',
  },
  {
    id: 'canal3',
    label: 'Canal 3 Bénin',
    sousTitre: 'Couverture complète en direct',
    icon: FaGlobe,
    iconComp: null,
    url: 'https://canal3benin.com/',
    color: 'bg-orange-600',
  },
]

function ModalDirect({ evenement, onClose }) {
  const liens = evenement.lien_virtuel
    ? [
        {
          id: 'officiel',
          label: 'Lien officiel de l\'événement',
          sousTitre: 'Source : organisateur officiel',
          icon: FaPlayCircle,
          iconComp: null,
          url: evenement.lien_virtuel,
          color: 'bg-terracotta',
        },
        ...CHAINES_DIRECT,
      ]
    : CHAINES_DIRECT

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-dark/70 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <FaPlayCircle className="text-white" size={20} />
            </div>
            <div>
              <p className="text-white font-bold">Suivre en direct</p>
              <p className="text-white/70 text-xs">Choisissez votre plateforme</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition">
            <FaTimes className="text-white" size={14} />
          </button>
        </div>

        {/* Platform list */}
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {liens.map(lien => {
            const Icon = lien.icon
            return (
              <a key={lien.id} href={lien.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl border-2 border-earth/15
                  hover:border-earth/40 hover:bg-sand/50 transition-all group">
                <div className={`w-11 h-11 ${lien.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  {lien.iconComp
                    ? <lien.iconComp size={18} />
                    : <Icon className="text-white" size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark text-sm">{lien.label}</p>
                  <p className="text-earth text-xs truncate">{lien.sousTitre}</p>
                </div>
                <span className="text-earth/40 group-hover:text-terracotta transition-colors text-lg">→</span>
              </a>
            )
          })}
        </div>

        <div className="px-4 pb-4">
          <p className="text-xs text-earth/60 text-center py-3 border-t border-earth/10">
            La retransmission peut commencer à l'heure officielle de l'événement
          </p>
        </div>
      </div>
    </div>
  )
}

export default function EvenementDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const [showDirect, setShowDirect] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['evenement', id],
    queryFn: () => evenementApi.detail(id),
  })
  const e = data?.data

  if (isLoading) return (
    <div className="pt-16 flex items-center justify-center h-screen bg-sand">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-terracotta border-t-transparent" />
    </div>
  )
  if (!e) return null

  const CatIcon = CATEGORIE_ICON[e.categorie] || FaTicketAlt
  const estGratuit = parseFloat(e.prix_entree || 0) === 0
  const estNational = e.categorie === 'national'
  const aLiveDirect = estNational || (estGratuit && e.type === 'hybride')
  const dateDebut = new Date(e.date_debut)
  const dateFin = e.date_fin ? new Date(e.date_fin) : null

  return (
    <>
      {showDirect && <ModalDirect evenement={e} onClose={() => setShowDirect(false)} />}

      <div className="pt-16">

        {/* ── Hero image / header ── */}
        <div className="relative h-72 sm:h-96 overflow-hidden">
          {e.image_principale_url ? (
            <>
              <img src={e.image_principale_url} alt={e.titre}
                className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/50 to-dark/20" />
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-dark to-dark/80 relative">
              <div className="absolute inset-0 opacity-20"
                style={{ background: 'radial-gradient(ellipse at 80% 50%, rgba(196,96,58,0.5), transparent)' }} />
            </div>
          )}

          <div className="absolute inset-0 flex items-end">
            <div className="max-w-5xl w-full mx-auto px-4 sm:px-8 pb-8">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-terracotta/90 backdrop-blur text-white p-2.5 rounded-xl">
                  <CatIcon size={22} />
                </span>
                {estNational && (
                  <span className="bg-dark/70 backdrop-blur border border-earth/30 text-earth text-xs
                    font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <FaFlag size={10} /> Événement national
                  </span>
                )}
                {estGratuit && (
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                    GRATUIT
                  </span>
                )}
                {aLiveDirect && (
                  <span className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full
                    flex items-center gap-1.5 animate-pulse">
                    <FaPlayCircle size={10} /> En direct
                  </span>
                )}
              </div>
              <h1 className="font-display text-4xl sm:text-5xl font-light text-white mb-2 leading-tight">
                {e.titre}
              </h1>
              <p className="text-white/70 flex items-center gap-2 text-sm">
                <FaMapMarkerAlt size={12} />
                {e.lieu} · {e.ville}
              </p>
            </div>
          </div>
        </div>

        {/* ── Content ── */}
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Main col */}
          <div className="lg:col-span-2 space-y-8">

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 bg-white rounded-2xl shadow-sm p-5 border border-earth/10">
              <div className="text-center">
                <div className="font-display text-2xl text-dark">
                  {format(dateDebut, 'dd MMM', { locale: fr })}
                </div>
                {dateFin && dateFin.toDateString() !== dateDebut.toDateString() && (
                  <div className="text-xs text-earth mt-0.5">
                    → {format(dateFin, 'dd MMM', { locale: fr })}
                  </div>
                )}
                <div className="text-xs text-earth mt-1 uppercase tracking-wide">Date</div>
              </div>
              <div className="text-center border-x border-earth/20">
                <div className="font-display text-2xl text-dark">
                  {e.nombre_places_total?.toLocaleString('fr-FR')}
                </div>
                <div className="text-xs text-earth mt-1 uppercase tracking-wide">Capacité</div>
              </div>
              <div className="text-center">
                <div className={`font-display text-2xl ${
                  e.nombre_places_disponibles === 0 ? 'text-red-500' : 'text-green-600'}`}>
                  {e.nombre_places_disponibles?.toLocaleString('fr-FR')}
                </div>
                <div className="text-xs text-earth mt-1 uppercase tracking-wide">Places restantes</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-semibold text-dark text-lg mb-3">À propos de l'événement</h2>
              <p className="text-dark/70 leading-relaxed">{e.description}</p>
            </div>

            {/* Programme */}
            {e.programme && Object.keys(e.programme).length > 0 && (
              <div>
                <h2 className="font-semibold text-dark text-lg mb-4">Programme</h2>
                <div className="space-y-3">
                  {Object.entries(e.programme).map(([moment, activites]) => (
                    <div key={moment} className="bg-sand rounded-2xl p-4">
                      <p className="font-semibold text-dark capitalize mb-2 text-sm">
                        {moment.replace(/_/g, ' ')}
                      </p>
                      <ul className="space-y-1">
                        {(Array.isArray(activites) ? activites : [activites]).map((act, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-dark/70">
                            <span className="w-1.5 h-1.5 bg-terracotta rounded-full mt-1.5 flex-shrink-0" />
                            {act}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live stream info for national events */}
            {aLiveDirect && (
              <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <FaPlayCircle className="text-white" size={18} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-dark mb-1">Suivez l'événement en direct</h3>
                    <p className="text-dark/60 text-sm mb-3">
                      {estNational
                        ? 'Cet événement national est retransmis en direct sur les chaînes nationales béninoises (ORTB) et les réseaux sociaux officiels du Gouvernement.'
                        : 'Cet événement est disponible en ligne via un lien de streaming officiel.'}
                    </p>
                    <button onClick={() => setShowDirect(true)}
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5
                        rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors">
                      <FaPlayCircle size={14} /> Voir les plateformes de diffusion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-2xl shadow-lg p-6 h-fit sticky top-24 border border-earth/10">

            {/* Price */}
            <div className="text-center mb-6 pb-6 border-b border-earth/15">
              {estGratuit ? (
                <div>
                  <div className="font-display text-3xl text-green-600 font-light">Gratuit</div>
                  <div className="text-earth text-sm mt-1">Entrée libre</div>
                </div>
              ) : (
                <div>
                  <div className="font-display text-3xl text-dark font-light">
                    {parseFloat(e.prix_entree || 0).toLocaleString('fr-FR')}
                    <span className="text-lg text-earth ml-1">FCFA</span>
                  </div>
                  <div className="text-earth text-sm mt-1">par personne</div>
                </div>
              )}
            </div>

            {/* CTA */}
            {aLiveDirect && estGratuit ? (
              <>
                <button onClick={() => setShowDirect(true)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 text-white
                    rounded-xl py-4 font-semibold text-base hover:bg-red-700 active:scale-[.98]
                    transition-all mb-3">
                  <FaPlayCircle size={16} /> Suivre en direct
                </button>
                {!estNational && e.nombre_places_disponibles > 0 && (
                  user ? (
                    <Link to={`/reservation/evenement/${e.id}`}
                      className="w-full flex items-center justify-center gap-2 border-2 border-earth/30
                        text-dark rounded-xl py-3 font-semibold text-sm hover:border-dark transition-all">
                      S'inscrire à l'événement
                    </Link>
                  ) : (
                    <Link to="/login"
                      className="w-full flex items-center justify-center border-2 border-earth/30
                        text-dark rounded-xl py-3 font-semibold text-sm hover:border-dark transition-all">
                      Se connecter pour s'inscrire
                    </Link>
                  )
                )}
              </>
            ) : e.nombre_places_disponibles > 0 ? (
              user ? (
                <Link to={`/reservation/evenement/${e.id}`}
                  className="w-full flex items-center justify-center gap-2 bg-terracotta text-white
                    rounded-xl py-4 font-semibold text-base hover:bg-terracotta/90 active:scale-[.98] transition-all">
                  <FaUsers size={15} /> S'inscrire →
                </Link>
              ) : (
                <Link to="/login"
                  className="w-full flex items-center justify-center bg-primary text-white
                    rounded-xl py-4 font-semibold text-base hover:bg-primary/90 transition-all">
                  Connexion pour s'inscrire
                </Link>
              )
            ) : (
              <div className="text-center py-4 bg-red-50 rounded-xl text-red-500 font-medium text-sm">
                Complet — Plus de places disponibles
              </div>
            )}

            {/* Trust signals */}
            <div className="mt-5 pt-5 border-t border-earth/10 text-xs text-earth space-y-2">
              <p className="flex items-center justify-center gap-1.5">
                <FaLock size={10} /> Paiement sécurisé en FCFA
              </p>
              <p className="flex items-center justify-center gap-1.5">
                <FaEnvelope size={10} /> Billet envoyé par e-mail
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
