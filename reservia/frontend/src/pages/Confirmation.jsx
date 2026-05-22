import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { reservationApi } from '../services/api'
import {
  FaCheckCircle, FaClock, FaDownload, FaHome,
  FaCalendarAlt, FaUsers, FaTag, FaEnvelope
} from 'react-icons/fa'

export default function Confirmation() {
  const { ref } = useParams()

  const { data, isLoading } = useQuery({
    queryKey: ['reservation', ref],
    queryFn:  () => reservationApi.detail(ref),
  })
  const r = data?.data

  const telechargerRecu = async () => {
    try {
      const response = await reservationApi.recu(ref)
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `recu-${ref}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // silently ignore
    }
  }

  if (isLoading) return (
    <div className="pt-16 flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  )

  const estConfirme = r?.statut === 'confirmée' || r?.statut_paiement === 'payé'

  return (
    <div className="pt-16 min-h-screen bg-sand flex items-start justify-center px-4 py-16">
      <div className="max-w-lg w-full">

        {estConfirme ? (
          <>
            {/* Icône succès */}
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600
                flex items-center justify-center shadow-xl shadow-green-200">
                <FaCheckCircle className="text-white" size={40} />
              </div>
            </div>

            <h1 className="font-display text-4xl font-light text-dark text-center mb-2">
              Réservation confirmée !
            </h1>
            <p className="text-earth text-center mb-8">
              Votre réservation a été traitée avec succès. Un e-mail de confirmation vous sera envoyé.
            </p>

            {/* Carte récapitulatif */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
              <div className="bg-dark text-white p-5 text-center">
                <div className="text-xs uppercase tracking-widest opacity-60 mb-1">Référence de réservation</div>
                <div className="font-mono font-bold text-2xl text-earth tracking-[4px]">{ref}</div>
              </div>

              <div className="p-5 space-y-3 text-sm">
                {r?.hebergement && (
                  <div className="flex justify-between">
                    <span className="text-earth">Hébergement</span>
                    <span className="font-medium text-dark text-right max-w-xs">{r.hebergement.titre}</span>
                  </div>
                )}
                {r?.evenement && (
                  <div className="flex justify-between">
                    <span className="text-earth">Événement</span>
                    <span className="font-medium text-dark text-right max-w-xs">{r.evenement.titre}</span>
                  </div>
                )}
                {r?.date_debut && (
                  <div className="flex justify-between items-center">
                    <span className="text-earth flex items-center gap-1"><FaCalendarAlt size={10} /> Arrivée</span>
                    <span>{new Date(r.date_debut).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {r?.date_fin && (
                  <div className="flex justify-between items-center">
                    <span className="text-earth flex items-center gap-1"><FaCalendarAlt size={10} /> Départ</span>
                    <span>{new Date(r.date_fin).toLocaleDateString('fr-FR')}</span>
                  </div>
                )}
                {r?.nombre_guests && (
                  <div className="flex justify-between items-center">
                    <span className="text-earth flex items-center gap-1"><FaUsers size={10} /> Voyageurs</span>
                    <span>{r.nombre_guests} personne{r.nombre_guests > 1 ? 's' : ''}</span>
                  </div>
                )}
                <div className="flex justify-between items-center font-bold border-t border-earth/20 pt-3">
                  <span className="flex items-center gap-1"><FaTag size={10} /> Montant payé</span>
                  <span className="text-terracotta">
                    {parseFloat(r?.prix_total || 0).toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                  <span className="text-green-700 text-xs font-semibold uppercase tracking-wide">
                    Statut paiement : {r?.statut_paiement || 'payé'}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/" className="btn-primary flex-1 justify-center gap-2">
                <FaHome size={14} /> Accueil
              </Link>
              <button onClick={telechargerRecu} className="btn-outline flex-1 justify-center gap-2">
                <FaDownload size={14} /> Télécharger reçu
              </button>
              <Link to="/profil" className="btn-outline flex-1 justify-center gap-2">
                <FaCalendarAlt size={14} /> Mes réservations
              </Link>
            </div>

            <p className="text-center text-xs text-earth mt-6 flex items-center justify-center gap-1">
              <FaEnvelope size={10} /> Un récapitulatif vous sera envoyé par email
            </p>
          </>
        ) : (
          <>
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 rounded-full bg-amber-100 flex items-center justify-center">
                <FaClock className="text-amber-500" size={40} />
              </div>
            </div>
            <h1 className="font-display text-4xl font-light text-dark text-center mb-4">
              Paiement en attente
            </h1>
            <p className="text-earth text-center mb-2">
              Référence : <strong className="text-terracotta font-mono">{ref}</strong>
            </p>
            <p className="text-earth/70 text-sm text-center mb-8">
              Votre paiement est en cours de traitement. Vous recevrez une confirmation par e-mail.
            </p>
            <Link to="/" className="btn-primary w-full justify-center gap-2">
              <FaHome size={14} /> Retour à l'accueil
            </Link>
          </>
        )}
      </div>
    </div>
  )
}
