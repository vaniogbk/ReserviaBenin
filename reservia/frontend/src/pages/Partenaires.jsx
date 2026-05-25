import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { partenaireApi } from '../services/api'
import {
  FaBuilding, FaCalendarAlt, FaChartLine, FaHandshake, FaShieldAlt,
  FaUsers, FaCheckCircle, FaArrowRight, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaStore, FaStar, FaGlobe,
} from 'react-icons/fa'

const AVANTAGES = [
  {
    icon: FaGlobe,
    titre: 'Visibilité nationale',
    desc: 'Votre établissement visible par des milliers de voyageurs et participants à travers le Bénin.',
  },
  {
    icon: FaChartLine,
    titre: 'Gestion simplifiée',
    desc: 'Tableau de bord dédié pour gérer vos réservations, disponibilités et revenus en temps réel.',
  },
  {
    icon: FaShieldAlt,
    titre: 'Paiements sécurisés',
    desc: 'MTN MoMo, Moov Money, carte bancaire — vos paiements sont traités automatiquement.',
  },
  {
    icon: FaUsers,
    titre: 'Support dédié',
    desc: 'Une équipe locale disponible pour vous accompagner à chaque étape de votre partenariat.',
  },
]

const ETAPES = [
  {
    num: '01',
    titre: 'Soumettez votre candidature',
    desc: 'Remplissez le formulaire ci-dessous. Notre équipe examine chaque dossier sous 48h.',
  },
  {
    num: '02',
    titre: 'Entretien & validation',
    desc: 'Nous vous contactons pour valider votre établissement et préparer votre profil sur la plateforme.',
  },
  {
    num: '03',
    titre: 'Mise en ligne & premières réservations',
    desc: 'Votre établissement est publié et visible immédiatement. Commencez à recevoir des réservations.',
  },
]

const TYPES = [
  { value: 'hebergement', label: 'Hôtel / Auberge / Maison d\'hôtes' },
  { value: 'evenement',   label: 'Organisateur d\'événements' },
  { value: 'restaurant',  label: 'Restaurant / Bar / Espace de fête' },
  { value: 'autre',       label: 'Autre activité touristique' },
]

export default function Partenaires() {
  const [submitted, setSubmitted] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      await partenaireApi.candidature(data)
      setSubmitted(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      toast.error(e.response?.data?.message || 'Une erreur est survenue. Veuillez réessayer.')
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-16 bg-sand flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaCheckCircle className="text-green-500" size={36} />
          </div>
          <h1 className="font-display text-3xl text-dark mb-3">Candidature envoyée !</h1>
          <p className="text-earth mb-2">
            Merci pour votre intérêt. Notre équipe examinera votre dossier et vous contactera
            sous <strong className="text-dark">48 heures ouvrées</strong>.
          </p>
          <p className="text-earth/60 text-sm mb-8">
            Un récapitulatif a été envoyé à l'adresse e-mail que vous avez indiquée.
          </p>
          <Link to="/" className="inline-flex items-center gap-2 bg-terracotta text-white
            rounded-2xl px-6 py-3 font-semibold hover:bg-terracotta/90 transition-colors">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand pt-16">

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-dark via-dark/95 to-dark/80 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-terracotta/20 text-terracotta rounded-full
            px-4 py-1.5 text-sm font-semibold mb-6">
            <FaHandshake size={13} /> Programme Partenaires
          </div>
          <h1 className="font-display text-4xl sm:text-5xl text-white mb-6 leading-tight">
            Développez votre activité<br />
            avec <span className="text-terracotta italic">Réservia</span> Bénin
          </h1>
          <p className="text-earth/80 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
            Rejoignez les hébergements, organisateurs d'événements et prestataires touristiques
            qui font confiance à Réservia pour toucher des milliers de clients à travers le Bénin.
          </p>
          <a href="#candidature"
            className="inline-flex items-center gap-2 bg-terracotta text-white rounded-2xl
              px-7 py-4 font-semibold text-base hover:bg-terracotta/90 transition-colors">
            Devenir partenaire <FaArrowRight size={14} />
          </a>
        </div>
      </section>

      {/* ── Avantages ── */}
      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-dark mb-3">Pourquoi nous rejoindre ?</h2>
            <p className="text-earth max-w-xl mx-auto">
              Des outils pensés pour les professionnels du tourisme béninois.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {AVANTAGES.map(({ icon: Icon, titre, desc }) => (
              <div key={titre} className="bg-white rounded-3xl p-6 shadow-sm border border-earth/10
                hover:shadow-md hover:-translate-y-0.5 transition-all">
                <div className="w-12 h-12 bg-terracotta/10 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="text-terracotta" size={20} />
                </div>
                <h3 className="font-semibold text-dark mb-2">{titre}</h3>
                <p className="text-earth text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Chiffres clés ── */}
      <section className="bg-dark py-14 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {[
            { val: '12',    label: 'Départements', icon: FaMapMarkerAlt },
            { val: '500+',  label: 'Établissements', icon: FaStore },
            { val: '10k+',  label: 'Utilisateurs', icon: FaUsers },
            { val: '4.8★',  label: 'Note moyenne', icon: FaStar },
          ].map(({ val, label, icon: Icon }) => (
            <div key={label}>
              <Icon className="text-terracotta mx-auto mb-2" size={20} />
              <div className="font-display text-3xl text-white mb-1">{val}</div>
              <div className="text-earth/60 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Comment ça marche ── */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl text-dark mb-3">Comment ça marche ?</h2>
            <p className="text-earth">Trois étapes simples pour rejoindre la plateforme.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ETAPES.map(({ num, titre, desc }) => (
              <div key={num} className="text-center">
                <div className="w-16 h-16 bg-terracotta rounded-2xl flex items-center justify-center
                  mx-auto mb-4 shadow-lg shadow-terracotta/20">
                  <span className="text-white font-bold text-xl">{num}</span>
                </div>
                <h3 className="font-semibold text-dark mb-2">{titre}</h3>
                <p className="text-earth text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Formulaire ── */}
      <section id="candidature" className="py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <div className="w-14 h-14 bg-terracotta/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FaHandshake className="text-terracotta" size={24} />
            </div>
            <h2 className="font-display text-3xl text-dark mb-2">Déposez votre candidature</h2>
            <p className="text-earth">Notre équipe vous répond sous 48 heures ouvrées.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Type d'activité */}
            <div>
              <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                Type d'activité <span className="text-terracotta">*</span>
              </label>
              <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                ${errors.type_activite ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                <FaBuilding className="text-earth/50 flex-shrink-0" size={14} />
                <select {...register('type_activite', { required: 'Requis' })}
                  className="flex-1 bg-transparent text-sm focus:outline-none text-dark">
                  <option value="">Sélectionnez votre activité</option>
                  {TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              {errors.type_activite && <p className="text-red-500 text-xs mt-1">{errors.type_activite.message}</p>}
            </div>

            {/* Nom de l'établissement */}
            <div>
              <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                Nom de l'établissement <span className="text-terracotta">*</span>
              </label>
              <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                ${errors.nom_etablissement ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                <FaStore className="text-earth/50 flex-shrink-0" size={14} />
                <input {...register('nom_etablissement', { required: 'Requis', minLength: { value: 2, message: 'Min. 2 caractères' } })}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="Ex : Hôtel Étoile du Sud" />
              </div>
              {errors.nom_etablissement && <p className="text-red-500 text-xs mt-1">{errors.nom_etablissement.message}</p>}
            </div>

            {/* Responsable */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'prenom_responsable', label: 'Prénom du responsable', placeholder: 'Kofi' },
                { name: 'nom_responsable',    label: 'Nom du responsable',    placeholder: 'Mensah' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                    {label} <span className="text-terracotta">*</span>
                  </label>
                  <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                    ${errors[name] ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                    <input {...register(name, { required: 'Requis', minLength: { value: 2, message: 'Min. 2 car.' } })}
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                      placeholder={placeholder} />
                  </div>
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                Adresse e-mail <span className="text-terracotta">*</span>
              </label>
              <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                ${errors.email ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                <FaEnvelope className="text-earth/50 flex-shrink-0" size={14} />
                <input type="email" {...register('email', {
                  required: 'Requis',
                  pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail invalide' },
                })}
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="contact@mon-etablissement.com" />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Téléphone + Ville */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                  Téléphone <span className="text-terracotta">*</span>
                </label>
                <div className={`flex items-center border-2 rounded-2xl overflow-hidden transition-colors
                  ${errors.telephone ? 'border-red-400' : 'border-earth/20 focus-within:border-dark'}`}>
                  <div className="px-3 py-3 bg-sand/50 border-r border-earth/20 text-sm font-bold text-dark flex-shrink-0">+229</div>
                  <div className="flex items-center flex-1 px-3 py-3 gap-2 bg-sand/20">
                    <FaPhone className="text-earth/50 flex-shrink-0" size={12} />
                    <input type="tel" {...register('telephone', { required: 'Requis' })}
                      className="flex-1 bg-transparent text-sm focus:outline-none font-mono"
                      placeholder="01 XX XX XX XX" />
                  </div>
                </div>
                {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                  Ville <span className="text-terracotta">*</span>
                </label>
                <div className={`flex items-center border-2 rounded-2xl px-4 py-3 gap-3 transition-colors
                  ${errors.ville ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark bg-sand/20'}`}>
                  <FaMapMarkerAlt className="text-earth/50 flex-shrink-0" size={14} />
                  <input {...register('ville', { required: 'Requis' })}
                    className="flex-1 bg-transparent text-sm focus:outline-none"
                    placeholder="Cotonou, Porto-Novo…" />
                </div>
                {errors.ville && <p className="text-red-500 text-xs mt-1">{errors.ville.message}</p>}
              </div>
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
                Décrivez votre établissement
              </label>
              <textarea {...register('message')} rows={4}
                className="w-full px-4 py-3 border-2 border-earth/20 rounded-2xl focus:outline-none
                  focus:border-dark text-sm resize-none bg-sand/20 transition-colors"
                placeholder="Capacité d'accueil, services proposés, localisation précise…" />
            </div>

            {/* CGU */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="accepte"
                className="mt-1 w-4 h-4 accent-terracotta cursor-pointer flex-shrink-0"
                {...register('accepte', { required: 'Vous devez accepter les conditions' })} />
              <label htmlFor="accepte" className="text-sm text-earth cursor-pointer leading-snug">
                J'accepte que Réservia Bénin traite mes données dans le cadre de cette candidature
                et me recontacte par e-mail ou téléphone.
              </label>
            </div>
            {errors.accepte && <p className="text-red-500 text-xs -mt-2">{errors.accepte.message}</p>}

            <button type="submit" disabled={isSubmitting}
              className="w-full bg-terracotta text-white rounded-2xl py-4 font-semibold text-base
                flex items-center justify-center gap-2 hover:bg-terracotta/90 transition-colors
                disabled:opacity-50">
              {isSubmitting
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Envoi en cours…</>
                : <><FaHandshake size={16} /> Envoyer ma candidature</>}
            </button>
          </form>

          <div className="mt-8 p-4 bg-sand rounded-2xl flex items-start gap-3 text-sm text-earth">
            <FaCalendarAlt className="text-terracotta flex-shrink-0 mt-0.5" size={14} />
            <span>
              Vous avez une question avant de postuler ? Contactez-nous directement à{' '}
              <a href="mailto:partenaires@reservia-benin.com"
                className="text-terracotta font-medium hover:underline">
                partenaires@reservia-benin.com
              </a>
            </span>
          </div>
        </div>
      </section>
    </div>
  )
}
