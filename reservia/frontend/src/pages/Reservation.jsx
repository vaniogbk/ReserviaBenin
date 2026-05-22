import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { hebergementApi, evenementApi, reservationApi, paiementApi } from '../services/api'
import toast from 'react-hot-toast'
import {
  FaCreditCard, FaMobileAlt, FaLock, FaCheckCircle,
  FaCalendarAlt, FaUsers, FaTag, FaFlask
} from 'react-icons/fa'

const STEPS = ['Séjour', 'Coordonnées', 'Paiement', 'Confirmation']

const METHODES = [
  { id: 'mtn_momo',   label: 'MTN MoMo',   type: 'mobile', couleur: 'bg-yellow-400' },
  { id: 'moov_money', label: 'Moov Money',  type: 'mobile', couleur: 'bg-blue-500' },
  { id: 'fedapay',    label: 'Carte bancaire', type: 'carte', couleur: 'bg-dark' },
  { id: 'cinetpay',   label: 'CinetPay',    type: 'carte', couleur: 'bg-orange-500' },
]

// Formate un numéro de carte avec espaces : "4242 4242 4242 4242"
function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

export default function Reservation() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [methode, setMethode] = useState('mtn_momo')
  const [paiementId, setPaiementId] = useState(null)
  const [reservation, setReservation] = useState(null)
  const [cardNum, setCardNum] = useState('')

  const {
    register, handleSubmit, watch,
    formState: { errors },
  } = useForm({ defaultValues: { nb_personnes: 2 } })

  // Chargement de la ressource (hôtel ou événement)
  const { data, isLoading } = useQuery({
    queryKey: [type, id],
    queryFn: () => type === 'hebergement' ? hebergementApi.detail(id) : evenementApi.detail(id),
  })
  const resource = data?.data

  // Calcul dynamique du total
  const dateDebut  = watch('date_debut')
  const dateFin    = watch('date_fin')
  const nbPersonnes = parseInt(watch('nb_personnes') || 2)
  const prix = parseFloat(resource?.prix_par_nuit || resource?.prix_entree || 0)
  const nbNuits = dateDebut && dateFin
    ? Math.max(1, Math.ceil((new Date(dateFin) - new Date(dateDebut)) / 86_400_000))
    : 1
  const montantBase = type === 'hebergement' ? prix * nbNuits : prix * nbPersonnes
  const fraisService = Math.round(montantBase * 0.05)
  const taxes        = Math.round(montantBase * 0.03)
  const total        = montantBase + fraisService + taxes

  // Étape 1 → 2 : Créer la réservation
  const creerMutation = useMutation({
    mutationFn: reservationApi.creer,
    onSuccess: ({ data: d }) => {
      setReservation(d)
      setStep(2)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur lors de la réservation.'),
  })

  // Étape 2 : Initier le paiement (obtenir un paiement_id)
  const initierMutation = useMutation({
    mutationFn: paiementApi.initier,
    onSuccess: ({ data: d }) => {
      setPaiementId(d.paiement_id)
      setStep(3)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur d\'initiation du paiement.'),
  })

  // Étape 3 : Confirmer le paiement (sandbox)
  const confirmerMutation = useMutation({
    mutationFn: ({ id: pid, payload }) => paiementApi.confirmer(pid, payload),
    onSuccess: ({ data: d }) => {
      toast.success('Paiement confirmé !')
      navigate(`/confirmation/${d.numero_reservation}`)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Échec du paiement.'),
  })

  const onSubmitSejour = () => setStep(1)

  const onSubmitCoordonnees = (formData) => {
    const payload = {
      type,
      notes_particulieres: formData.notes_particulieres,
    }
    if (type === 'hebergement') {
      payload.hebergement_id = parseInt(id)
      payload.date_debut     = formData.date_debut
      payload.date_fin       = formData.date_fin
      payload.nombre_guests  = nbPersonnes
    } else {
      payload.evenement_id   = parseInt(id)
      payload.nombre_places  = nbPersonnes
    }
    creerMutation.mutate(payload)
  }

  const onChoisirMethode = () => {
    if (!reservation) return
    initierMutation.mutate({
      numero_reservation: reservation.numero_reservation,
      methode,
    })
  }

  const onConfirmerPaiement = (formData) => {
    const methodeInfo = METHODES.find(m => m.id === methode)
    const payload = methodeInfo?.type === 'carte'
      ? {
          numero_carte: cardNum.replace(/\s/g, ''),
          expiration:   formData.expiration,
          cvv:          formData.cvv,
          nom_carte:    formData.nom_carte,
        }
      : { telephone: formData.telephone }

    confirmerMutation.mutate({ id: paiementId, payload })
  }

  if (isLoading) return (
    <div className="pt-16 flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent" />
    </div>
  )

  const methodeCourante = METHODES.find(m => m.id === methode)
  const estCarte = methodeCourante?.type === 'carte'

  return (
    <div className="pt-16 min-h-screen bg-sand">
      {/* Barre de progression */}
      <div className="bg-white border-b border-earth/20 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div className={`flex items-center gap-2 text-sm font-medium whitespace-nowrap
                ${i < step ? 'text-green-600' : i === step ? 'text-dark' : 'text-earth/40'}`}>
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${i < step ? 'bg-green-500 text-white' : i === step ? 'bg-dark text-white' : 'bg-earth/10 text-earth/40'}`}>
                  {i < step ? <FaCheckCircle size={12} /> : i + 1}
                </div>
                <span className="hidden sm:inline">{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="flex-1 h-px bg-earth/15 mx-3" />}
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ── Formulaire principal ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* ÉTAPE 0 : Dates & options */}
          {step === 0 && resource && (
            <form onSubmit={handleSubmit(onSubmitSejour)} className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl text-dark mb-6 flex items-center gap-2">
                <FaCalendarAlt className="text-terracotta text-xl" /> Votre séjour
              </h2>

              {type === 'hebergement' && (
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="form-label">Arrivée *</label>
                    <input type="date" className="form-input"
                      min={new Date().toISOString().split('T')[0]}
                      {...register('date_debut', { required: 'Requis' })} />
                    {errors.date_debut && <p className="text-red-500 text-xs mt-1">{errors.date_debut.message}</p>}
                  </div>
                  <div>
                    <label className="form-label">Départ *</label>
                    <input type="date" className="form-input"
                      min={dateDebut || new Date().toISOString().split('T')[0]}
                      {...register('date_fin', { required: 'Requis' })} />
                    {errors.date_fin && <p className="text-red-500 text-xs mt-1">{errors.date_fin.message}</p>}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <label className="form-label flex items-center gap-1">
                  <FaUsers className="text-earth" /> {type === 'hebergement' ? 'Nombre de voyageurs' : 'Nombre de places'}
                </label>
                <select {...register('nb_personnes')} className="form-input">
                  {[1,2,3,4,5,6,8,10].map(n => (
                    <option key={n} value={n}>{n} personne{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="form-label">Demandes spéciales (optionnel)</label>
                <textarea {...register('notes_particulieres')} rows={3}
                  className="form-input resize-none"
                  placeholder="Allergie, lit bébé, arrivée tardive..." />
              </div>

              <button type="submit" className="btn-primary w-full justify-center py-4">
                Continuer →
              </button>
            </form>
          )}

          {/* ÉTAPE 1 : Coordonnées */}
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitCoordonnees)} className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl text-dark mb-6">Vos coordonnées</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="form-label">Prénom *</label>
                  <input {...register('prenom', { required: 'Requis' })} className="form-input" placeholder="Kofi" />
                  {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
                </div>
                <div>
                  <label className="form-label">Nom *</label>
                  <input {...register('nom', { required: 'Requis' })} className="form-input" placeholder="Mensah" />
                  {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label">Email *</label>
                <input type="email" {...register('email', { required: 'Requis' })} className="form-input"
                  placeholder="kofi@exemple.com" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              <div className="mb-6">
                <label className="form-label">Téléphone</label>
                <input type="tel" {...register('telephone')} className="form-input"
                  placeholder="+229 96 00 00 00" />
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(0)} className="btn-outline flex-1 justify-center">
                  ← Retour
                </button>
                <button type="submit" disabled={creerMutation.isPending}
                  className="btn-primary flex-1 justify-center">
                  {creerMutation.isPending ? 'Traitement…' : 'Continuer →'}
                </button>
              </div>
            </form>
          )}

          {/* ÉTAPE 2 : Choix méthode de paiement */}
          {step === 2 && reservation && (
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="font-display text-2xl text-dark mb-2">Moyen de paiement</h2>
              <p className="text-earth text-sm mb-6">Choisissez comment vous souhaitez régler votre réservation.</p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {METHODES.map(m => (
                  <button key={m.id} type="button" onClick={() => setMethode(m.id)}
                    className={`p-4 rounded-xl border-2 text-left transition-all
                      ${methode === m.id ? 'border-dark bg-dark text-white' : 'border-earth/30 hover:border-dark bg-white'}`}>
                    <div className={`w-8 h-8 rounded-lg ${methode === m.id ? 'bg-white/20' : m.couleur}
                      flex items-center justify-center mb-2`}>
                      {m.type === 'mobile'
                        ? <FaMobileAlt className={methode === m.id ? 'text-white' : 'text-white'} size={14} />
                        : <FaCreditCard className={methode === m.id ? 'text-white' : 'text-white'} size={14} />
                      }
                    </div>
                    <div className="text-sm font-semibold">{m.label}</div>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-6 text-sm text-green-700">
                <FaLock size={12} />
                <span>Paiement sécurisé · Données chiffrées AES-256</span>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(1)} className="btn-outline flex-1 justify-center">
                  ← Retour
                </button>
                <button onClick={onChoisirMethode} disabled={initierMutation.isPending}
                  className="btn-terracotta flex-1 justify-center">
                  {initierMutation.isPending ? 'Traitement…' : `Payer ${total.toLocaleString('fr-FR')} FCFA →`}
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Formulaire de paiement sandbox */}
          {step === 3 && paiementId && (
            <form onSubmit={handleSubmit(onConfirmerPaiement)} className="bg-white rounded-2xl p-6 shadow-sm">
              {/* Badge sandbox */}
              <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6">
                <FaFlask className="text-amber-500" />
                <div>
                  <span className="text-amber-700 font-semibold text-sm">Mode TEST (Sandbox)</span>
                  <p className="text-amber-600 text-xs">
                    {estCarte
                      ? 'Utilisez le numéro test : 4242 4242 4242 4242, expiry 12/26, CVV 123'
                      : 'Entrez n\'importe quel numéro de téléphone béninois (ex: +229 96 000 000)'}
                  </p>
                </div>
              </div>

              <h2 className="font-display text-2xl text-dark mb-6 flex items-center gap-2">
                {estCarte ? <FaCreditCard className="text-terracotta" /> : <FaMobileAlt className="text-terracotta" />}
                {estCarte ? 'Paiement par carte' : `Paiement via ${methodeCourante?.label}`}
              </h2>

              {estCarte ? (
                <>
                  {/* Visuel carte */}
                  <div className="bg-gradient-to-br from-dark to-earth rounded-2xl p-5 mb-6 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-10 translate-x-10" />
                    <div className="text-xs tracking-widest opacity-60 mb-4 uppercase">Carte de paiement</div>
                    <div className="font-mono text-xl tracking-[4px] mb-4">
                      {cardNum || '•••• •••• •••• ••••'}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="opacity-60">{watch('nom_carte') || 'TITULAIRE'}</span>
                      <span>{watch('expiration') || 'MM/AA'}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label">Numéro de carte *</label>
                    <input type="text" className="form-input font-mono tracking-widest"
                      placeholder="4242 4242 4242 4242"
                      value={cardNum}
                      onChange={e => setCardNum(formatCard(e.target.value))}
                      maxLength={19} required />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="form-label">Date d'expiration *</label>
                      <input type="text" className="form-input" placeholder="MM/AA"
                        {...register('expiration', {
                          required: 'Requis',
                          pattern: { value: /^\d{2}\/\d{2}$/, message: 'Format MM/AA' },
                        })} maxLength={5} />
                      {errors.expiration && <p className="text-red-500 text-xs mt-1">{errors.expiration.message}</p>}
                    </div>
                    <div>
                      <label className="form-label">CVV *</label>
                      <input type="text" className="form-input font-mono" placeholder="123"
                        {...register('cvv', { required: 'Requis', minLength: 3, maxLength: 4 })}
                        maxLength={4} />
                      {errors.cvv && <p className="text-red-500 text-xs mt-1">CVV invalide</p>}
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="form-label">Nom sur la carte *</label>
                    <input type="text" className="form-input uppercase"
                      placeholder="KOFI MENSAH"
                      {...register('nom_carte', { required: 'Requis', minLength: 3 })} />
                    {errors.nom_carte && <p className="text-red-500 text-xs mt-1">Requis</p>}
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="form-label">Numéro de téléphone *</label>
                    <div className="flex gap-2">
                      <span className="form-input w-24 text-center bg-sand text-dark font-semibold flex-shrink-0">+229</span>
                      <input type="tel" className="form-input flex-1"
                        placeholder="96 00 00 00"
                        {...register('telephone', {
                          required: 'Requis',
                          pattern: { value: /^[0-9]{8}$/, message: '8 chiffres requis' },
                        })} maxLength={8} />
                    </div>
                    {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
                    <p className="text-earth text-xs mt-2">
                      En mode test : confirmez directement sans OTP réel.
                    </p>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl p-3 mb-6">
                <FaLock className="text-green-600" size={12} />
                <span className="text-green-700 text-sm">Paiement sécurisé · {total.toLocaleString('fr-FR')} FCFA</span>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1 justify-center">
                  ← Retour
                </button>
                <button type="submit" disabled={confirmerMutation.isPending}
                  className="btn-terracotta flex-1 justify-center py-4 text-base">
                  {confirmerMutation.isPending
                    ? 'Traitement en cours…'
                    : `Confirmer ${total.toLocaleString('fr-FR')} FCFA`}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* ── Récapitulatif ── */}
        <aside className="bg-white rounded-2xl shadow-sm overflow-hidden h-fit sticky top-28">
          <div className="bg-dark text-white p-5">
            <div className="text-xs uppercase tracking-widest opacity-60 mb-1">Récapitulatif</div>
            <div className="font-display text-lg leading-snug">{resource?.titre || resource?.nom}</div>
          </div>

          <div className="p-5 space-y-3 text-sm">
            {reservation?.numero_reservation && (
              <div className="bg-sand rounded-xl p-3 text-center mb-2">
                <div className="text-xs text-earth mb-1">Référence</div>
                <div className="font-mono font-bold text-terracotta tracking-wider">
                  {reservation.numero_reservation}
                </div>
              </div>
            )}

            {type === 'hebergement' && dateDebut && dateFin && (
              <div className="flex justify-between text-earth">
                <span className="flex items-center gap-1"><FaCalendarAlt size={10} /> {nbNuits} nuit{nbNuits > 1 ? 's' : ''}</span>
                <span>{prix.toLocaleString('fr-FR')} × {nbNuits}</span>
              </div>
            )}

            {type === 'evenement' && (
              <div className="flex justify-between text-earth">
                <span className="flex items-center gap-1"><FaUsers size={10} /> {nbPersonnes} place{nbPersonnes > 1 ? 's' : ''}</span>
                <span>{prix.toLocaleString('fr-FR')} × {nbPersonnes}</span>
              </div>
            )}

            <div className="flex justify-between"><span className="text-earth">Sous-total</span><span>{montantBase.toLocaleString('fr-FR')} FCFA</span></div>
            <div className="flex justify-between"><span className="text-earth">Frais service (5%)</span><span>{fraisService.toLocaleString('fr-FR')} FCFA</span></div>
            <div className="flex justify-between"><span className="text-earth">Taxes (3%)</span><span>{taxes.toLocaleString('fr-FR')} FCFA</span></div>

            <div className="flex justify-between font-bold text-base border-t border-earth/20 pt-3">
              <span className="flex items-center gap-1"><FaTag size={10} /> Total TTC</span>
              <span className="text-terracotta">{total.toLocaleString('fr-FR')} FCFA</span>
            </div>

            <p className="text-center text-xs text-earth pt-2 flex items-center justify-center gap-1">
              <FaLock size={10} /> Annulation gratuite avant 48h
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
