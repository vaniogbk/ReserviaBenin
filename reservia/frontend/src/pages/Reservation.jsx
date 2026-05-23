import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { hebergementApi, evenementApi, reservationApi, paiementApi } from '../services/api'
import toast from 'react-hot-toast'
import {
  FaCreditCard, FaMobileAlt, FaLock, FaCheckCircle,
  FaCalendarAlt, FaUsers, FaTag, FaFlask, FaArrowLeft,
  FaArrowRight, FaShieldAlt, FaBolt, FaCheck
} from 'react-icons/fa'

const STEPS = [
  { label: 'Séjour',        icon: FaCalendarAlt },
  { label: 'Coordonnées',   icon: FaUsers },
  { label: 'Paiement',      icon: FaCreditCard },
  { label: 'Confirmation',  icon: FaCheckCircle },
]

const METHODES = [
  { id: 'mtn_momo',    label: 'MTN MoMo',      sousTitre: 'Mobile Money',   bg: 'from-yellow-400 to-yellow-500',  border: 'border-yellow-400', text: 'text-yellow-900' },
  { id: 'moov_money',  label: 'Moov Money',    sousTitre: 'Mobile Money',   bg: 'from-blue-500 to-blue-600',      border: 'border-blue-500',   text: 'text-white' },
  { id: 'fedapay',     label: 'Carte bancaire', sousTitre: 'Visa / Mastercard', bg: 'from-slate-700 to-slate-900', border: 'border-slate-700',  text: 'text-white' },
  { id: 'cinetpay',    label: 'CinetPay',       sousTitre: 'Carte / Mobile',  bg: 'from-orange-500 to-red-500',   border: 'border-orange-500', text: 'text-white' },
]

function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function Counter({ value, onChange, min = 1, max = 20 }) {
  return (
    <div className="flex items-center gap-4">
      <button type="button" onClick={() => onChange(Math.max(min, value - 1))}
        className="w-10 h-10 rounded-full border-2 border-earth/40 flex items-center justify-center
          text-earth hover:border-dark hover:text-dark transition-all font-bold text-lg disabled:opacity-30"
        disabled={value <= min}>−</button>
      <span className="w-10 text-center font-bold text-xl text-dark">{value}</span>
      <button type="button" onClick={() => onChange(Math.min(max, value + 1))}
        className="w-10 h-10 rounded-full border-2 border-earth/40 flex items-center justify-center
          text-earth hover:border-dark hover:text-dark transition-all font-bold text-lg disabled:opacity-30"
        disabled={value >= max}>+</button>
    </div>
  )
}

export default function Reservation() {
  const { type, id } = useParams()
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [methode, setMethode] = useState('mtn_momo')
  const [paiementId, setPaiementId] = useState(null)
  const [reservation, setReservation] = useState(null)
  const [cardNum, setCardNum] = useState('')
  const [nbPersonnes, setNbPersonnes] = useState(2)

  const { register, handleSubmit, watch, formState: { errors } } = useForm()

  const { data, isLoading } = useQuery({
    queryKey: [type, id],
    queryFn: () => type === 'hebergement' ? hebergementApi.detail(id) : evenementApi.detail(id),
  })
  const resource = data?.data

  const dateDebut = watch('date_debut')
  const dateFin   = watch('date_fin')
  const prix      = parseFloat(resource?.prix_par_nuit || resource?.prix_entree || 0)
  const nbNuits   = dateDebut && dateFin
    ? Math.max(1, Math.ceil((new Date(dateFin) - new Date(dateDebut)) / 86_400_000))
    : 1
  const montantBase  = type === 'hebergement' ? prix * nbNuits : prix * nbPersonnes
  const fraisService = Math.round(montantBase * 0.05)
  const taxes        = Math.round(montantBase * 0.03)
  const total        = montantBase + fraisService + taxes

  const creerMutation = useMutation({
    mutationFn: reservationApi.creer,
    onSuccess: ({ data: d }) => { setReservation(d); setStep(2) },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur lors de la réservation.'),
  })

  const initierMutation = useMutation({
    mutationFn: paiementApi.initier,
    onSuccess: ({ data: d }) => { setPaiementId(d.paiement_id); setStep(3) },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur d\'initiation du paiement.'),
  })

  const confirmerMutation = useMutation({
    mutationFn: ({ id: pid, payload }) => paiementApi.confirmer(pid, payload),
    onSuccess: ({ data: d }) => {
      toast.success('Paiement confirmé !')
      navigate(`/confirmation/${d.numero_reservation}`)
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Échec du paiement.'),
  })

  const onSubmitCoordonnees = (formData) => {
    const payload = { type, notes_particulieres: formData.notes_particulieres }
    if (type === 'hebergement') {
      Object.assign(payload, {
        hebergement_id: parseInt(id),
        date_debut:     formData.date_debut,
        date_fin:       formData.date_fin,
        nombre_guests:  nbPersonnes,
      })
    } else {
      Object.assign(payload, {
        evenement_id:  parseInt(id),
        nombre_places: nbPersonnes,
      })
    }
    creerMutation.mutate(payload)
  }

  const onChoisirMethode = () => {
    if (!reservation) return
    initierMutation.mutate({ numero_reservation: reservation.numero_reservation, methode })
  }

  const onConfirmerPaiement = (formData) => {
    const methodeInfo = METHODES.find(m => m.id === methode)
    const payload = methodeInfo?.id === 'fedapay' || methodeInfo?.id === 'cinetpay'
      ? { numero_carte: cardNum.replace(/\s/g, ''), expiration: formData.expiration, cvv: formData.cvv, nom_carte: formData.nom_carte }
      : { telephone: formData.telephone }
    confirmerMutation.mutate({ id: paiementId, payload })
  }

  if (isLoading) return (
    <div className="pt-16 flex items-center justify-center h-screen bg-sand">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-terracotta border-t-transparent" />
        <p className="text-earth text-sm">Chargement…</p>
      </div>
    </div>
  )

  const methodeCourante = METHODES.find(m => m.id === methode)
  const estCarte = methode === 'fedapay' || methode === 'cinetpay'

  return (
    <div className="pt-16 min-h-screen bg-sand">

      {/* ── Barre de progression ── */}
      <div className="bg-white border-b border-earth/15 sticky top-16 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between relative">
            {/* Ligne de fond */}
            <div className="absolute top-4 left-8 right-8 h-0.5 bg-earth/15 z-0" />
            {/* Ligne de progression */}
            <div className="absolute top-4 left-8 h-0.5 bg-terracotta z-0 transition-all duration-500"
              style={{ width: `calc(${(step / (STEPS.length - 1)) * 100}% - 4rem)` }} />

            {STEPS.map((s, i) => {
              const Icon = s.icon
              const done    = i < step
              const current = i === step
              return (
                <div key={s.label} className="relative z-10 flex flex-col items-center gap-1.5">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                    ${done    ? 'bg-terracotta text-white shadow-md shadow-terracotta/30'
                    : current ? 'bg-dark text-white shadow-md shadow-dark/30'
                    :           'bg-white border-2 border-earth/30 text-earth/40'}`}>
                    {done ? <FaCheck size={12} /> : <Icon size={12} />}
                  </div>
                  <span className={`text-xs font-medium whitespace-nowrap hidden sm:block
                    ${done ? 'text-terracotta' : current ? 'text-dark' : 'text-earth/40'}`}>
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-5 gap-8">

        {/* ── Formulaire principal ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* ÉTAPE 0 : Séjour */}
          {step === 0 && resource && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-dark to-dark/80 text-white p-6">
                <h2 className="font-display text-2xl font-light mb-1">Votre séjour</h2>
                <p className="text-earth/60 text-sm">{resource.titre || resource.nom}</p>
              </div>
              <div className="p-6 space-y-6">

                {type === 'hebergement' && (
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'date_debut', label: 'Arrivée', min: new Date().toISOString().split('T')[0] },
                      { name: 'date_fin',   label: 'Départ',  min: dateDebut || new Date().toISOString().split('T')[0] },
                    ].map(({ name, label, min }) => (
                      <div key={name}>
                        <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                          {label}
                        </label>
                        <div className="relative">
                          <FaCalendarAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-earth/60" size={14} />
                          <input type="date" className="w-full pl-9 pr-3 py-3 border border-earth/20 rounded-xl
                            focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark text-sm bg-sand/50"
                            min={min} {...register(name, { required: 'Requis' })} />
                        </div>
                        {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-3">
                    {type === 'hebergement' ? 'Voyageurs' : 'Nombre de places'}
                  </label>
                  <Counter value={nbPersonnes} onChange={setNbPersonnes} />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                    Demandes spéciales
                  </label>
                  <textarea {...register('notes_particulieres')} rows={3}
                    className="w-full px-4 py-3 border border-earth/20 rounded-xl focus:outline-none
                      focus:ring-2 focus:ring-dark/20 focus:border-dark text-sm resize-none bg-sand/30"
                    placeholder="Allergie, lit bébé, arrivée tardive…" />
                </div>

                <button onClick={() => setStep(1)}
                  className="w-full bg-dark text-white rounded-xl py-4 font-semibold flex items-center
                    justify-center gap-2 hover:bg-dark/90 active:scale-[.98] transition-all">
                  Continuer <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ÉTAPE 1 : Coordonnées */}
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitCoordonnees)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-dark to-dark/80 text-white p-6">
                <h2 className="font-display text-2xl font-light mb-1">Vos coordonnées</h2>
                <p className="text-earth/60 text-sm">Ces informations sont sécurisées et chiffrées</p>
              </div>
              <div className="p-6 space-y-4">

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: 'prenom', label: 'Prénom', placeholder: 'Kofi' },
                    { name: 'nom',    label: 'Nom',    placeholder: 'Mensah' },
                  ].map(({ name, label, placeholder }) => (
                    <div key={name}>
                      <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">{label} *</label>
                      <input {...register(name, { required: 'Requis' })}
                        className="w-full px-4 py-3 border border-earth/20 rounded-xl focus:outline-none
                          focus:ring-2 focus:ring-dark/20 focus:border-dark text-sm"
                        placeholder={placeholder} />
                      {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">Email *</label>
                  <input type="email" {...register('email', { required: 'Requis' })}
                    className="w-full px-4 py-3 border border-earth/20 rounded-xl focus:outline-none
                      focus:ring-2 focus:ring-dark/20 focus:border-dark text-sm"
                    placeholder="kofi@exemple.com" />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">Téléphone</label>
                  <div className="flex gap-2">
                    <span className="px-4 py-3 border border-earth/20 rounded-xl bg-sand/50 text-sm font-semibold text-dark flex-shrink-0">+229</span>
                    <input type="tel" {...register('telephone')}
                      className="flex-1 px-4 py-3 border border-earth/20 rounded-xl focus:outline-none
                        focus:ring-2 focus:ring-dark/20 focus:border-dark text-sm"
                      placeholder="96 00 00 00" />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(0)}
                    className="flex-1 py-3.5 border-2 border-earth/30 rounded-xl text-dark font-semibold
                      flex items-center justify-center gap-2 hover:border-dark transition-all">
                    <FaArrowLeft size={13} /> Retour
                  </button>
                  <button type="submit" disabled={creerMutation.isPending}
                    className="flex-1 py-3.5 bg-dark text-white rounded-xl font-semibold flex items-center
                      justify-center gap-2 hover:bg-dark/90 active:scale-[.98] transition-all disabled:opacity-60">
                    {creerMutation.isPending ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</> : <>Continuer <FaArrowRight size={13} /></>}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ÉTAPE 2 : Choix méthode */}
          {step === 2 && reservation && (
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-dark to-dark/80 text-white p-6">
                <h2 className="font-display text-2xl font-light mb-1">Moyen de paiement</h2>
                <p className="text-earth/60 text-sm">Choisissez votre méthode préférée</p>
              </div>
              <div className="p-6">

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {METHODES.map(m => (
                    <button key={m.id} type="button" onClick={() => setMethode(m.id)}
                      className={`relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden
                        ${methode === m.id ? `border-transparent bg-gradient-to-br ${m.bg} text-white shadow-lg` : 'border-earth/20 bg-white hover:border-earth/50'}`}>
                      {methode === m.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-white/20 rounded-full flex items-center justify-center">
                          <FaCheck size={9} className="text-white" />
                        </div>
                      )}
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3
                        ${methode === m.id ? 'bg-white/20' : 'bg-sand'}`}>
                        {m.id === 'fedapay' || m.id === 'cinetpay'
                          ? <FaCreditCard size={16} className={methode === m.id ? 'text-white' : 'text-earth'} />
                          : <FaMobileAlt size={16} className={methode === m.id ? 'text-white' : 'text-earth'} />}
                      </div>
                      <div className={`font-bold text-sm ${methode === m.id ? 'text-white' : 'text-dark'}`}>{m.label}</div>
                      <div className={`text-xs mt-0.5 ${methode === m.id ? 'text-white/70' : 'text-earth'}`}>{m.sousTitre}</div>
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl mb-6 text-sm">
                  <FaShieldAlt className="text-green-500 flex-shrink-0" size={16} />
                  <div>
                    <span className="font-semibold text-green-700">Paiement 100% sécurisé</span>
                    <p className="text-green-600 text-xs mt-0.5">Vos données sont chiffrées AES-256 et jamais stockées</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3.5 border-2 border-earth/30 rounded-xl text-dark font-semibold
                      flex items-center justify-center gap-2 hover:border-dark transition-all">
                    <FaArrowLeft size={13} /> Retour
                  </button>
                  <button onClick={onChoisirMethode} disabled={initierMutation.isPending}
                    className="flex-1 py-3.5 bg-terracotta text-white rounded-xl font-semibold flex items-center
                      justify-center gap-2 hover:bg-terracotta/90 active:scale-[.98] transition-all disabled:opacity-60">
                    {initierMutation.isPending
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
                      : <><FaBolt size={13} /> Payer {total.toLocaleString('fr-FR')} FCFA</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ÉTAPE 3 : Saisie paiement */}
          {step === 3 && paiementId && (
            <form onSubmit={handleSubmit(onConfirmerPaiement)}
              className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-dark to-dark/80 text-white p-6">
                <h2 className="font-display text-2xl font-light mb-1 flex items-center gap-2">
                  {estCarte ? <FaCreditCard size={20} /> : <FaMobileAlt size={20} />}
                  {estCarte ? 'Paiement par carte' : `Paiement ${methodeCourante?.label}`}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  <FaFlask className="text-amber-400" size={12} />
                  <span className="text-amber-300 text-xs font-medium">Mode Sandbox — Simulation uniquement</span>
                </div>
              </div>
              <div className="p-6 space-y-5">

                {/* Astuce sandbox */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm">
                  <p className="font-semibold text-amber-700 mb-1">Données de test</p>
                  <p className="text-amber-600 text-xs">
                    {estCarte
                      ? 'Carte : 4242 4242 4242 4242 · Expiry : 12/26 · CVV : 123'
                      : 'Téléphone : 96 000 000 (8 chiffres, sans indicatif)'}
                  </p>
                </div>

                {estCarte ? (
                  <>
                    {/* Visuel carte */}
                    <div className="bg-gradient-to-br from-dark via-dark/90 to-earth/60 rounded-2xl p-6 text-white relative overflow-hidden select-none">
                      <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
                      <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-6">
                          <div className="text-xs tracking-[3px] opacity-50 uppercase">Réservation</div>
                          <FaCreditCard className="opacity-40" size={28} />
                        </div>
                        <div className="font-mono text-xl tracking-[6px] mb-5 min-h-7">
                          {cardNum || '•••• •••• •••• ••••'}
                        </div>
                        <div className="flex justify-between text-sm">
                          <div>
                            <div className="text-xs opacity-50 mb-0.5">Titulaire</div>
                            <div className="font-semibold uppercase tracking-wider text-sm">
                              {watch('nom_carte') || '••••••••'}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs opacity-50 mb-0.5">Expire</div>
                            <div className="font-mono">{watch('expiration') || 'MM/AA'}</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">Numéro de carte *</label>
                      <input type="text" className="w-full px-4 py-3 border border-earth/20 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark font-mono tracking-widest text-sm"
                        placeholder="4242 4242 4242 4242"
                        value={cardNum} onChange={e => setCardNum(formatCard(e.target.value))} maxLength={19} required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">Expiration *</label>
                        <input type="text" className="w-full px-4 py-3 border border-earth/20 rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark font-mono text-sm"
                          placeholder="MM/AA"
                          {...register('expiration', { required: 'Requis', pattern: { value: /^\d{2}\/\d{2}$/, message: 'Format MM/AA' } })}
                          maxLength={5} />
                        {errors.expiration && <p className="text-red-500 text-xs mt-1">{errors.expiration.message}</p>}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">CVV *</label>
                        <input type="text" className="w-full px-4 py-3 border border-earth/20 rounded-xl
                          focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark font-mono text-sm"
                          placeholder="123"
                          {...register('cvv', { required: 'Requis', minLength: 3, maxLength: 4 })} maxLength={4} />
                        {errors.cvv && <p className="text-red-500 text-xs mt-1">CVV invalide</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">Nom sur la carte *</label>
                      <input type="text" className="w-full px-4 py-3 border border-earth/20 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark text-sm uppercase tracking-wider"
                        placeholder="KOFI MENSAH"
                        {...register('nom_carte', { required: 'Requis', minLength: 3 })} />
                      {errors.nom_carte && <p className="text-red-500 text-xs mt-1">Requis</p>}
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                      Numéro {methodeCourante?.label} *
                    </label>
                    <div className="flex gap-2">
                      <span className="px-4 py-3 border border-earth/20 rounded-xl bg-sand/50 text-sm font-bold text-dark flex-shrink-0">+229</span>
                      <input type="tel" className="flex-1 px-4 py-3 border border-earth/20 rounded-xl
                        focus:outline-none focus:ring-2 focus:ring-dark/20 focus:border-dark text-sm font-mono tracking-widest"
                        placeholder="96 00 00 00"
                        {...register('telephone', {
                          required: 'Requis',
                          pattern: { value: /^[0-9]{8}$/, message: '8 chiffres requis' },
                        })} maxLength={8} />
                    </div>
                    {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
                  </div>
                )}

                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl">
                  <FaLock className="text-green-500 flex-shrink-0" size={12} />
                  <span className="text-green-700 text-xs">Connexion sécurisée SSL · {total.toLocaleString('fr-FR')} FCFA</span>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 py-3.5 border-2 border-earth/30 rounded-xl text-dark font-semibold
                      flex items-center justify-center gap-2 hover:border-dark transition-all">
                    <FaArrowLeft size={13} /> Retour
                  </button>
                  <button type="submit" disabled={confirmerMutation.isPending}
                    className="flex-1 py-4 bg-terracotta text-white rounded-xl font-semibold text-base
                      flex items-center justify-center gap-2 hover:bg-terracotta/90 active:scale-[.98] transition-all disabled:opacity-60">
                    {confirmerMutation.isPending
                      ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
                      : <><FaShieldAlt size={15} /> Confirmer {total.toLocaleString('fr-FR')} FCFA</>}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* ── Récapitulatif ── */}
        <aside className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-28">
            {resource?.image_principale_url && (
              <div className="h-36 overflow-hidden">
                <img src={resource.image_principale_url} alt={resource.titre || resource.nom}
                  className="w-full h-full object-cover" />
              </div>
            )}

            <div className="p-5">
              <div className="text-xs uppercase tracking-widest text-earth mb-1">
                {type === 'hebergement' ? 'Hébergement' : 'Événement'}
              </div>
              <div className="font-display text-lg text-dark leading-tight mb-4">
                {resource?.titre || resource?.nom}
              </div>

              {reservation?.numero_reservation && (
                <div className="bg-sand rounded-xl p-3 text-center mb-4">
                  <div className="text-xs text-earth mb-1">Référence</div>
                  <div className="font-mono font-bold text-terracotta tracking-wider text-sm">
                    {reservation.numero_reservation}
                  </div>
                </div>
              )}

              <div className="space-y-2.5 text-sm">
                {type === 'hebergement' && dateDebut && dateFin && (
                  <div className="flex justify-between text-earth">
                    <span className="flex items-center gap-1.5"><FaCalendarAlt size={10} /> {nbNuits} nuit{nbNuits > 1 ? 's' : ''}</span>
                    <span className="text-dark">{prix.toLocaleString('fr-FR')} × {nbNuits}</span>
                  </div>
                )}
                {type === 'evenement' && (
                  <div className="flex justify-between text-earth">
                    <span className="flex items-center gap-1.5"><FaUsers size={10} /> {nbPersonnes} place{nbPersonnes > 1 ? 's' : ''}</span>
                    <span className="text-dark">{prix.toLocaleString('fr-FR')} × {nbPersonnes}</span>
                  </div>
                )}
                <div className="flex justify-between text-earth/80">
                  <span>Sous-total</span>
                  <span className="text-dark">{montantBase.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-earth/80">
                  <span>Frais service (5%)</span>
                  <span className="text-dark">{fraisService.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between text-earth/80">
                  <span>Taxes (3%)</span>
                  <span className="text-dark">{taxes.toLocaleString('fr-FR')} FCFA</span>
                </div>
                <div className="flex justify-between font-bold text-base border-t border-earth/20 pt-3 mt-3">
                  <span className="flex items-center gap-1.5"><FaTag size={10} /> Total TTC</span>
                  <span className="text-terracotta">{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-earth/10 flex items-center gap-2 text-xs text-earth/60">
                <FaLock size={9} /> Annulation gratuite avant 48h
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
