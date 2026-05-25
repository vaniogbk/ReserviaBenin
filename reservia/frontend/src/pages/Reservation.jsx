import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { useAuth } from '../context/AuthContext'
import { hebergementApi, evenementApi, reservationApi, paiementApi } from '../services/api'
import toast from 'react-hot-toast'
import {
  FaCreditCard, FaMobileAlt, FaLock, FaCheckCircle,
  FaCalendarAlt, FaUsers, FaTag, FaFlask, FaArrowLeft,
  FaArrowRight, FaShieldAlt, FaBolt, FaCheck, FaPaypal,
  FaUser, FaEnvelope, FaPhone, FaInfoCircle
} from 'react-icons/fa'

// ─── Constants ─────────────────────────────────────────────────────────────

const STEPS = [
  { label: 'Séjour',        icon: FaCalendarAlt },
  { label: 'Coordonnées',   icon: FaUsers },
  { label: 'Paiement',      icon: FaCreditCard },
  { label: 'Confirmation',  icon: FaCheckCircle },
]

const METHODES = [
  {
    id: 'mtn_momo',
    label: 'MTN MoMo',
    sousTitre: 'Mobile Money',
    bg: 'from-yellow-400 to-yellow-500',
    border: 'border-yellow-400',
    selectedText: 'text-yellow-900',
  },
  {
    id: 'moov_money',
    label: 'Moov Money',
    sousTitre: 'Mobile Money',
    bg: 'from-blue-500 to-blue-700',
    border: 'border-blue-500',
    selectedText: 'text-white',
  },
  {
    id: 'fedapay',
    label: 'Carte bancaire',
    sousTitre: 'Visa / Mastercard',
    bg: 'from-slate-700 to-slate-900',
    border: 'border-slate-700',
    selectedText: 'text-white',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    sousTitre: 'Paiement international',
    bg: 'from-blue-600 to-blue-800',
    border: 'border-blue-600',
    selectedText: 'text-white',
  },
]

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatCard(val) {
  return val.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}

function formatExpiry(val) {
  const digits = val.replace(/\D/g, '').slice(0, 4)
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2)
  return digits
}

// ─── Counter ───────────────────────────────────────────────────────────────

function Counter({ value, onChange, min = 1, max = 20 }) {
  return (
    <div className="flex items-center gap-4">
      <button type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="w-10 h-10 rounded-full border-2 border-earth/40 flex items-center justify-center
          text-earth hover:border-dark hover:text-dark transition-all font-bold text-lg disabled:opacity-30">
        −
      </button>
      <span className="w-10 text-center font-bold text-2xl text-dark">{value}</span>
      <button type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="w-10 h-10 rounded-full border-2 border-earth/40 flex items-center justify-center
          text-earth hover:border-dark hover:text-dark transition-all font-bold text-lg disabled:opacity-30">
        +
      </button>
    </div>
  )
}

// ─── Form Field ────────────────────────────────────────────────────────────

function Field({ label, error, required, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
        {label} {required && <span className="text-terracotta">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 text-red-500 text-xs mt-1.5">
          <FaInfoCircle size={10} /> {error.message}
        </p>
      )}
    </div>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function Reservation() {
  const { type, id } = useParams()
  const navigate  = useNavigate()
  const location  = useLocation()
  const chambreId = new URLSearchParams(location.search).get('chambre')
  const { user }  = useAuth()

  const [step, setStep] = useState(0)
  const [methode, setMethode] = useState(
    () => localStorage.getItem('reservia_paiement_methode') || 'mtn_momo'
  )
  const [paiementId, setPaiementId] = useState(null)
  const [reservation, setReservation] = useState(null)
  const [cardNum, setCardNum] = useState('')
  const [nbPersonnes, setNbPersonnes] = useState(1)

  const { register, handleSubmit, watch, trigger, setValue, formState: { errors } } = useForm({ mode: 'onBlur' })

  const { data, isLoading } = useQuery({
    queryKey: [type, id],
    queryFn: () => type === 'hebergement' ? hebergementApi.detail(id) : evenementApi.detail(id),
  })
  const resource = data?.data

  // Charger les chambres si une chambre est sélectionnée
  const { data: chambresData } = useQuery({
    queryKey: ['chambres', id],
    queryFn: () => hebergementApi.chambres(id),
    enabled: !!chambreId && type === 'hebergement',
  })
  const chambre = chambreId && chambresData?.data
    ? chambresData.data.find(c => c.id === parseInt(chambreId))
    : null

  const dateDebut = watch('date_debut')
  const dateFin   = watch('date_fin')
  const prix      = chambre
    ? parseFloat(chambre.prix_par_nuit || 0)
    : parseFloat(resource?.prix_par_nuit || resource?.prix_entree || 0)
  const nbNuits   = dateDebut && dateFin
    ? Math.max(1, Math.ceil((new Date(dateFin) - new Date(dateDebut)) / 86_400_000))
    : 1
  const total = type === 'hebergement' ? prix * nbNuits : prix * nbPersonnes

  // ── Scroll en haut à chaque changement d'étape ──
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, [step])

  // ── Pré-remplissage depuis le profil utilisateur ──
  useEffect(() => {
    if (user) {
      if (user.prenom)    setValue('prenom',             user.prenom)
      if (user.nom)       setValue('nom',                user.nom)
      if (user.email)     setValue('email',              user.email)
      if (user.telephone) setValue('telephone_contact',  user.telephone)
    }
  }, [user, setValue])

  // Pré-remplir les champs de paiement quand on arrive à l'étape paiement
  useEffect(() => {
    if (step === 3 && user) {
      if (methode === 'mtn_momo' || methode === 'moov_money') {
        if (user.telephone) setValue('telephone', user.telephone)
      }
      if (methode === 'paypal') {
        if (user.email) setValue('paypal_email', user.email)
      }
    }
  }, [step, methode, user, setValue])

  // ── Mutations ──

  const creerMutation = useMutation({
    mutationFn: reservationApi.creer,
    onSuccess: ({ data: d }) => {
      setReservation(d)
      if (d.prix_total == 0) {
        toast.success('Inscription confirmée — événement gratuit !')
        navigate(`/confirmation/${d.numero_reservation}`)
      } else {
        setStep(2)
      }
    },
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

  // ── Step handlers ──

  const handleStep0Next = async () => {
    if (type === 'hebergement') {
      const ok = await trigger(['date_debut', 'date_fin'])
      if (!ok) return
    }
    setStep(1)
  }

  const onSubmitCoordonnees = (formData) => {
    const payload = { type, notes_particulieres: formData.notes_particulieres }
    if (type === 'hebergement') {
      Object.assign(payload, {
        hebergement_id: parseInt(id),
        chambre_id:     chambreId ? parseInt(chambreId) : null,
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
    let payload
    if (methode === 'fedapay') {
      payload = {
        numero_carte: cardNum.replace(/\s/g, ''),
        expiration: formData.expiration,
        cvv: formData.cvv,
        nom_carte: formData.nom_carte,
      }
    } else if (methode === 'paypal') {
      payload = { paypal_email: formData.paypal_email }
    } else {
      // Strip all non-digits before sending (handles spaces, dashes)
      payload = { telephone: formData.telephone.replace(/\D/g, '') }
    }
    confirmerMutation.mutate({ id: paiementId, payload })
  }

  // ── Loading ──

  if (isLoading) return (
    <div className="pt-16 flex items-center justify-center h-screen bg-sand">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-terracotta border-t-transparent" />
        <p className="text-earth text-sm">Chargement…</p>
      </div>
    </div>
  )

  const methodeCourante = METHODES.find(m => m.id === methode)
  const estCarte  = methode === 'fedapay'
  const estPaypal = methode === 'paypal'
  const estMobile = methode === 'mtn_momo' || methode === 'moov_money'

  const today = new Date().toISOString().split('T')[0]

  return (
    <div className="pt-16 min-h-screen bg-sand">

      {/* ── Progress bar ── */}
      <div className="bg-white border-b border-earth/15 sticky top-16 z-20 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-5">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-8 right-8 h-0.5 bg-earth/15 z-0" />
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

        {/* ── Main form ── */}
        <div className="lg:col-span-3 space-y-6">

          {/* ── STEP 0: Séjour ── */}
          {step === 0 && resource && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-earth/10">
              <div className="bg-gradient-to-r from-dark to-dark/80 text-white px-6 py-5">
                <p className="text-earth/60 text-xs uppercase tracking-widest mb-1">
                  {type === 'hebergement' ? 'Hébergement' : 'Événement'}
                </p>
                <h2 className="font-display text-2xl font-light">Votre séjour</h2>
              </div>

              <div className="p-6 space-y-7">

                {type === 'hebergement' && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-earth uppercase tracking-widest mb-4">
                        Dates de séjour <span className="text-terracotta">*</span>
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          { name: 'date_debut', label: 'Arrivée', min: today, validate: v => v >= today || 'Date passée' },
                          { name: 'date_fin',   label: 'Départ',  min: dateDebut || today,
                            validate: v => !dateDebut || v > dateDebut || 'Doit être après l\'arrivée' },
                        ].map(({ name, label, min, validate }) => (
                          <div key={name} className={`rounded-2xl border-2 transition-all overflow-hidden
                            ${errors[name] ? 'border-red-400 bg-red-50' : 'border-earth/20 bg-sand/40 focus-within:border-dark'}`}>
                            <label className="block text-xs font-semibold text-earth px-4 pt-3 pb-1 uppercase tracking-wider">
                              {label}
                            </label>
                            <div className="flex items-center gap-2 px-4 pb-3">
                              <FaCalendarAlt className="text-earth/50 flex-shrink-0" size={14} />
                              <input type="date"
                                className="flex-1 bg-transparent text-sm text-dark focus:outline-none"
                                min={min}
                                {...register(name, { required: 'Requis', validate })} />
                            </div>
                            {errors[name] && (
                              <p className="px-4 pb-2 text-red-500 text-xs flex items-center gap-1">
                                <FaInfoCircle size={9} /> {errors[name].message}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {dateDebut && dateFin && new Date(dateFin) > new Date(dateDebut) && (
                      <div className="bg-sand rounded-2xl px-5 py-3 flex items-center justify-between text-sm">
                        <span className="text-earth">Durée du séjour</span>
                        <span className="font-bold text-dark">{nbNuits} nuit{nbNuits > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </>
                )}

                <div>
                  <p className="text-xs font-semibold text-earth uppercase tracking-widest mb-4">
                    {type === 'hebergement' ? 'Nombre de voyageurs' : 'Nombre de places'}
                  </p>
                  <div className="bg-sand/50 rounded-2xl px-6 py-5 flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-dark text-sm">
                        {type === 'hebergement' ? 'Voyageurs' : 'Participants'}
                      </p>
                      <p className="text-earth text-xs mt-0.5">Adultes et enfants</p>
                    </div>
                    <Counter value={nbPersonnes} onChange={setNbPersonnes} />
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-earth uppercase tracking-widest mb-2">
                    Demandes spéciales
                  </p>
                  <textarea {...register('notes_particulieres')} rows={3}
                    className="w-full px-4 py-3 border-2 border-earth/15 rounded-2xl focus:outline-none
                      focus:border-dark text-sm resize-none bg-sand/20 transition-colors"
                    placeholder="Allergie, lit bébé, arrivée tardive, régime alimentaire…" />
                </div>

                <button type="button" onClick={handleStep0Next}
                  className="w-full bg-dark text-white rounded-2xl py-4 font-semibold flex items-center
                    justify-center gap-2 hover:bg-dark/90 active:scale-[.98] transition-all text-base">
                  Continuer <FaArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 1: Coordonnées ── */}
          {step === 1 && (
            <form onSubmit={handleSubmit(onSubmitCoordonnees)}
              className="bg-white rounded-3xl shadow-sm overflow-hidden border border-earth/10">
              <div className="bg-gradient-to-r from-dark to-dark/80 text-white px-6 py-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <FaUser size={16} className="text-earth" />
                  </div>
                  <h2 className="font-display text-2xl font-light">Vos coordonnées</h2>
                </div>
                <p className="text-earth/60 text-sm ml-13 pl-[3.25rem]">
                  Toutes vos informations sont chiffrées et sécurisées
                </p>
              </div>

              <div className="p-6 space-y-5">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Prénom" required error={errors.prenom}>
                    <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                      ${errors.prenom ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                      <FaUser className="text-earth/50 flex-shrink-0" size={14} />
                      <input
                        {...register('prenom', {
                          required: 'Le prénom est requis',
                          minLength: { value: 2, message: 'Min. 2 caractères' },
                        })}
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                        placeholder="Kofi" />
                    </div>
                  </Field>

                  <Field label="Nom" required error={errors.nom}>
                    <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                      ${errors.nom ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                      <FaUser className="text-earth/50 flex-shrink-0" size={14} />
                      <input
                        {...register('nom', {
                          required: 'Le nom est requis',
                          minLength: { value: 2, message: 'Min. 2 caractères' },
                        })}
                        className="flex-1 bg-transparent text-sm focus:outline-none"
                        placeholder="Mensah" />
                    </div>
                  </Field>
                </div>

                <Field label="Adresse e-mail" required error={errors.email}>
                  <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                    ${errors.email ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                    <FaEnvelope className="text-earth/50 flex-shrink-0" size={14} />
                    <input type="email"
                      {...register('email', {
                        required: 'L\'e-mail est requis',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Adresse e-mail invalide',
                        },
                      })}
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                      placeholder="kofi.mensah@exemple.com" />
                  </div>
                </Field>

                <Field label="Téléphone" required error={errors.telephone_contact}>
                  <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-colors
                    ${errors.telephone_contact ? 'border-red-400' : 'border-earth/20 focus-within:border-dark'}`}>
                    {/* Country prefix */}
                    <div className="flex items-center gap-2 px-4 py-3 bg-sand/50 border-r border-earth/20 flex-shrink-0">
                      <span className="text-lg">🇧🇯</span>
                      <span className="text-sm font-bold text-dark">+229</span>
                    </div>
                    <div className={`flex items-center flex-1 px-4 py-3 gap-3
                      ${errors.telephone_contact ? 'bg-red-50' : 'bg-sand/20'}`}>
                      <FaPhone className="text-earth/50 flex-shrink-0" size={13} />
                      <input type="tel"
                        {...register('telephone_contact', {
                          required: 'Le numéro de téléphone est requis',
                          pattern: {
                            value: /^01[0-9]{8}$/,
                            message: 'Format requis : 01 XX XX XX XX (10 chiffres)',
                          },
                        })}
                        className="flex-1 bg-transparent text-sm font-mono tracking-widest focus:outline-none"
                        placeholder="01 96 XX XX XX"
                        maxLength={10} />
                    </div>
                  </div>
                  {!errors.telephone_contact && (
                    <p className="text-earth/60 text-xs mt-1.5 ml-1">
                      Format béninois : 01 suivi de 8 chiffres
                    </p>
                  )}
                </Field>

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setStep(0)}
                    className="flex-1 py-3.5 border-2 border-earth/30 rounded-2xl text-dark font-semibold
                      flex items-center justify-center gap-2 hover:border-dark transition-all">
                    <FaArrowLeft size={13} /> Retour
                  </button>
                  <button type="submit" disabled={creerMutation.isPending}
                    className="flex-1 py-3.5 bg-dark text-white rounded-2xl font-semibold flex items-center
                      justify-center gap-2 hover:bg-dark/90 active:scale-[.98] transition-all disabled:opacity-60">
                    {creerMutation.isPending
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
                      : <>Continuer <FaArrowRight size={13} /></>}
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ── STEP 2: Méthode de paiement ── */}
          {step === 2 && reservation && (
            <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-earth/10">
              <div className="bg-gradient-to-r from-dark to-dark/80 text-white px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    <FaCreditCard size={16} className="text-earth" />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-light">Moyen de paiement</h2>
                    <p className="text-earth/60 text-sm">Choisissez votre méthode préférée</p>
                  </div>
                </div>
              </div>

              <div className="p-6">

                <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 mb-6">
                  {METHODES.map(m => {
                    const selected = methode === m.id
                    return (
                      <button key={m.id} type="button" onClick={() => {
                        setMethode(m.id)
                        localStorage.setItem('reservia_paiement_methode', m.id)
                      }}
                        className={`relative p-4 rounded-2xl border-2 text-left transition-all overflow-hidden
                          ${selected
                            ? `border-transparent bg-gradient-to-br ${m.bg} shadow-lg scale-[1.02]`
                            : 'border-earth/20 bg-white hover:border-earth/40 hover:bg-sand/30'}`}>

                        {selected && (
                          <div className="absolute top-2.5 right-2.5 w-5 h-5 bg-white/25 rounded-full
                            flex items-center justify-center">
                            <FaCheck size={9} className="text-white" />
                          </div>
                        )}

                        {/* Icon */}
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3
                          ${selected ? 'bg-white/20' : 'bg-sand'}`}>
                          {m.id === 'paypal'
                            ? <FaPaypal size={18} className={selected ? 'text-white' : 'text-blue-600'} />
                            : m.id === 'fedapay'
                            ? <FaCreditCard size={16} className={selected ? 'text-white' : 'text-earth'} />
                            : <FaMobileAlt size={16} className={selected ? 'text-white' : 'text-earth'} />}
                        </div>

                        <div className={`font-bold text-sm ${selected ? 'text-white' : 'text-dark'}`}>
                          {m.label}
                        </div>
                        <div className={`text-xs mt-0.5 ${selected ? 'text-white/75' : 'text-earth'}`}>
                          {m.sousTitre}
                        </div>
                      </button>
                    )
                  })}
                </div>

                {/* Security banner */}
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-2xl mb-6">
                  <FaShieldAlt className="text-green-500 flex-shrink-0 mt-0.5" size={16} />
                  <div>
                    <span className="font-semibold text-green-700 text-sm">Paiement 100% sécurisé</span>
                    <p className="text-green-600 text-xs mt-0.5">
                      Vos données sont chiffrées AES-256 et ne sont jamais stockées sur nos serveurs
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button type="button" onClick={() => setStep(1)}
                    className="flex-1 py-3.5 border-2 border-earth/30 rounded-2xl text-dark font-semibold
                      flex items-center justify-center gap-2 hover:border-dark transition-all">
                    <FaArrowLeft size={13} /> Retour
                  </button>
                  <button onClick={onChoisirMethode} disabled={initierMutation.isPending}
                    className="flex-1 py-3.5 bg-terracotta text-white rounded-2xl font-semibold flex items-center
                      justify-center gap-2 hover:bg-terracotta/90 active:scale-[.98] transition-all disabled:opacity-60">
                    {initierMutation.isPending
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
                      : <><FaBolt size={13} /> Payer {total.toLocaleString('fr-FR')} FCFA</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3: Saisie paiement ── */}
          {step === 3 && paiementId && (
            <form onSubmit={handleSubmit(onConfirmerPaiement)}
              className="bg-white rounded-3xl shadow-sm overflow-hidden border border-earth/10">

              <div className="bg-gradient-to-r from-dark to-dark/80 text-white px-6 py-5">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                    {estCarte
                      ? <FaCreditCard size={16} className="text-earth" />
                      : estPaypal
                      ? <FaPaypal size={16} className="text-blue-300" />
                      : <FaMobileAlt size={16} className="text-earth" />}
                  </div>
                  <h2 className="font-display text-2xl font-light">
                    {estCarte ? 'Paiement par carte'
                      : estPaypal ? 'Paiement PayPal'
                      : `Paiement ${methodeCourante?.label}`}
                  </h2>
                </div>
                <div className="flex items-center gap-2 pl-[3.25rem]">
                  <FaFlask className="text-amber-400" size={11} />
                  <span className="text-amber-300 text-xs font-medium">Mode Sandbox — Simulation uniquement</span>
                </div>
              </div>

              <div className="p-6 space-y-5">

                {/* Sandbox hint */}
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="font-semibold text-amber-700 text-sm mb-1">Données de test</p>
                  <p className="text-amber-600 text-xs">
                    {estCarte
                      ? 'Carte : 4242 4242 4242 4242 · Expiry : 12/26 · CVV : 123 · Nom : TEST USER'
                      : estPaypal
                      ? 'E-mail PayPal : sandbox@paypal.com'
                      : 'Téléphone : 01 96 00 00 00 (format 01XXXXXXXX, 10 chiffres)'}
                  </p>
                </div>

                {/* ─── Card payment ─── */}
                {estCarte && (
                  <>
                    {/* Card preview */}
                    <div className="bg-gradient-to-br from-dark via-dark/90 to-earth/60 rounded-2xl p-6
                      text-white relative overflow-hidden select-none shadow-xl">
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

                    <Field label="Numéro de carte" required error={errors.numero_carte_field}>
                      <input type="text"
                        className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none font-mono
                          tracking-widest text-sm transition-colors
                          ${errors.numero_carte_field ? 'border-red-400 bg-red-50' : 'border-earth/20 focus:border-dark bg-sand/20'}`}
                        placeholder="4242 4242 4242 4242"
                        value={cardNum}
                        onChange={e => setCardNum(formatCard(e.target.value))}
                        maxLength={19}
                        required />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Expiration" required error={errors.expiration}>
                        <input type="text"
                          className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none font-mono text-sm
                            transition-colors ${errors.expiration ? 'border-red-400 bg-red-50' : 'border-earth/20 focus:border-dark bg-sand/20'}`}
                          placeholder="MM/AA"
                          maxLength={5}
                          {...register('expiration', {
                            required: 'Requis',
                            pattern: { value: /^\d{2}\/\d{2}$/, message: 'Format MM/AA' },
                            validate: v => {
                              const [mm, yy] = v.split('/')
                              const exp = new Date(2000 + parseInt(yy), parseInt(mm) - 1, 1)
                              return exp > new Date() || 'Carte expirée'
                            },
                          })}
                          onChange={e => {
                            const formatted = formatExpiry(e.target.value)
                            e.target.value = formatted
                          }} />
                      </Field>

                      <Field label="CVV" required error={errors.cvv}>
                        <input type="text"
                          className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none font-mono text-sm
                            transition-colors ${errors.cvv ? 'border-red-400 bg-red-50' : 'border-earth/20 focus:border-dark bg-sand/20'}`}
                          placeholder="123"
                          maxLength={4}
                          {...register('cvv', {
                            required: 'Requis',
                            minLength: { value: 3, message: '3-4 chiffres' },
                            maxLength: { value: 4, message: '3-4 chiffres' },
                            pattern: { value: /^\d{3,4}$/, message: '3-4 chiffres' },
                          })} />
                      </Field>
                    </div>

                    <Field label="Nom sur la carte" required error={errors.nom_carte}>
                      <input type="text"
                        className={`w-full px-4 py-3 border-2 rounded-2xl focus:outline-none text-sm uppercase
                          tracking-wider transition-colors
                          ${errors.nom_carte ? 'border-red-400 bg-red-50' : 'border-earth/20 focus:border-dark bg-sand/20'}`}
                        placeholder="KOFI MENSAH"
                        {...register('nom_carte', {
                          required: 'Requis',
                          minLength: { value: 3, message: 'Min. 3 caractères' },
                        })} />
                    </Field>
                  </>
                )}

                {/* ─── PayPal ─── */}
                {estPaypal && (
                  <div>
                    {/* PayPal branding */}
                    <div className="bg-[#003087] rounded-2xl p-5 text-white mb-5 flex items-center gap-4">
                      <FaPaypal size={36} className="text-[#009cde]" />
                      <div>
                        <p className="font-bold text-lg">PayPal</p>
                        <p className="text-white/70 text-xs">Paiement international sécurisé</p>
                      </div>
                    </div>

                    <Field label="Adresse e-mail PayPal" required error={errors.paypal_email}>
                      <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                        ${errors.paypal_email ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                        <FaEnvelope className="text-earth/50 flex-shrink-0" size={14} />
                        <input type="email"
                          {...register('paypal_email', {
                            required: 'L\'e-mail PayPal est requis',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'E-mail invalide',
                            },
                          })}
                          className="flex-1 bg-transparent text-sm focus:outline-none"
                          placeholder="votre-email@paypal.com" />
                      </div>
                    </Field>
                  </div>
                )}

                {/* ─── Mobile Money ─── */}
                {estMobile && (
                  <div>
                    {/* Mobile banner */}
                    <div className={`rounded-2xl p-5 mb-5 flex items-center gap-4
                      ${methode === 'mtn_momo'
                        ? 'bg-gradient-to-r from-yellow-400 to-yellow-500'
                        : 'bg-gradient-to-r from-blue-500 to-blue-700'}`}>
                      <FaMobileAlt size={32} className={methode === 'mtn_momo' ? 'text-yellow-900' : 'text-white'} />
                      <div>
                        <p className={`font-bold text-lg ${methode === 'mtn_momo' ? 'text-yellow-900' : 'text-white'}`}>
                          {methodeCourante?.label}
                        </p>
                        <p className={`text-xs ${methode === 'mtn_momo' ? 'text-yellow-800/70' : 'text-white/70'}`}>
                          Votre numéro {methodeCourante?.label} du Bénin
                        </p>
                      </div>
                    </div>

                    <Field label={`Numéro ${methodeCourante?.label}`} required error={errors.telephone}>
                      <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-colors
                        ${errors.telephone ? 'border-red-400' : 'border-earth/20 focus-within:border-dark'}`}>
                        <div className="flex items-center gap-2 px-4 py-3 bg-sand/50 border-r border-earth/20 flex-shrink-0">
                          <span className="text-lg">🇧🇯</span>
                          <span className="text-sm font-bold text-dark">+229</span>
                        </div>
                        <div className={`flex items-center flex-1 px-4 py-3 gap-3
                          ${errors.telephone ? 'bg-red-50' : 'bg-sand/20'}`}>
                          <FaPhone className="text-earth/50 flex-shrink-0" size={13} />
                          <input type="tel"
                            {...register('telephone', {
                              required: 'Le numéro est requis',
                              pattern: {
                                value: /^01[0-9]{8}$/,
                                message: 'Format requis : 01 XX XX XX XX (10 chiffres)',
                              },
                            })}
                            className="flex-1 bg-transparent text-sm font-mono tracking-widest focus:outline-none"
                            placeholder="01 XX XX XX XX"
                            maxLength={10} />
                        </div>
                      </div>
                      {!errors.telephone && (
                        <p className="text-earth/60 text-xs mt-1.5 ml-1">
                          Exemple : 01 96 00 00 00 (nouveau format béninois, 10 chiffres)
                        </p>
                      )}
                    </Field>
                  </div>
                )}

                {/* SSL indicator */}
                <div className="flex items-center gap-2 p-3.5 bg-green-50 border border-green-100 rounded-2xl">
                  <FaLock className="text-green-500 flex-shrink-0" size={12} />
                  <span className="text-green-700 text-xs font-medium">
                    Connexion sécurisée SSL · Montant : {total.toLocaleString('fr-FR')} FCFA
                  </span>
                </div>

                <div className="flex gap-3 pt-1">
                  <button type="button" onClick={() => setStep(2)}
                    className="flex-1 py-3.5 border-2 border-earth/30 rounded-2xl text-dark font-semibold
                      flex items-center justify-center gap-2 hover:border-dark transition-all">
                    <FaArrowLeft size={13} /> Retour
                  </button>
                  <button type="submit" disabled={confirmerMutation.isPending}
                    className="flex-1 py-4 bg-terracotta text-white rounded-2xl font-semibold text-base
                      flex items-center justify-center gap-2 hover:bg-terracotta/90 active:scale-[.98]
                      transition-all disabled:opacity-60">
                    {confirmerMutation.isPending
                      ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Traitement…</>
                      : <><FaShieldAlt size={15} /> Confirmer {total.toLocaleString('fr-FR')} FCFA</>}
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* ── Récapitulatif sidebar ── */}
        <aside className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm overflow-hidden sticky top-28 border border-earth/10">

            {resource?.image_principale_url && (
              <div className="h-40 overflow-hidden relative">
                <img src={resource.image_principale_url} alt={resource.titre || resource.nom}
                  className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/40 to-transparent" />
              </div>
            )}

            <div className="p-5">
              <div className="text-xs uppercase tracking-widest text-earth mb-1">
                {type === 'hebergement' ? 'Hébergement' : 'Événement'}
              </div>
              <div className="font-display text-lg text-dark leading-tight mb-1">
                {resource?.titre || resource?.nom}
              </div>
              {chambre && (
                <div className="text-sm text-terracotta font-medium mb-4">{chambre.nom}</div>
              )}
              {!chambre && <div className="mb-4" />}

              {reservation?.numero_reservation && (
                <div className="bg-sand rounded-2xl p-3 text-center mb-5">
                  <div className="text-xs text-earth mb-1">Référence</div>
                  <div className="font-mono font-bold text-terracotta tracking-wider text-sm">
                    {reservation.numero_reservation}
                  </div>
                </div>
              )}

              <div className="space-y-2.5 text-sm">
                {type === 'hebergement' && dateDebut && dateFin && (
                  <div className="flex justify-between text-earth">
                    <span className="flex items-center gap-1.5">
                      <FaCalendarAlt size={10} />
                      {nbNuits} nuit{nbNuits > 1 ? 's' : ''}
                    </span>
                    <span className="text-dark">{prix.toLocaleString('fr-FR')} × {nbNuits}</span>
                  </div>
                )}
                {type === 'evenement' && (
                  <div className="flex justify-between text-earth">
                    <span className="flex items-center gap-1.5">
                      <FaUsers size={10} />
                      {nbPersonnes} place{nbPersonnes > 1 ? 's' : ''}
                    </span>
                    <span className="text-dark">{prix.toLocaleString('fr-FR')} × {nbPersonnes}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base border-t border-earth/20 pt-3 mt-1">
                  <span className="flex items-center gap-1.5"><FaTag size={10} /> Total TTC</span>
                  <span className="text-terracotta">{total.toLocaleString('fr-FR')} FCFA</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-earth/10 flex items-center gap-1.5 text-xs text-earth/60">
                <FaLock size={9} /> Annulation gratuite avant 48h
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
