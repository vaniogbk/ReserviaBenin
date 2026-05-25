import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../services/api'
import toast from 'react-hot-toast'
import {
  FaUser, FaEnvelope, FaLock, FaPhone,
  FaCheckCircle, FaRedo, FaArrowRight,
} from 'react-icons/fa'

export default function Register() {
  const { loginFromToken } = useAuth()
  const navigate = useNavigate()

  // 'form' | 'otp'
  const [step, setStep]               = useState('form')
  const [userId, setUserId]           = useState(null)
  const [emailMasque, setEmailMasque] = useState('')
  const [otp, setOtp]                 = useState('')
  const [otpLoading, setOtpLoading]   = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm()

  // ── Soumission du formulaire d'inscription ───────────────────────────────
  const onSubmit = async (data) => {
    // Honeypot : si le champ caché est rempli, c'est un robot
    if (data._trap) return
    try {
      const res = await authApi.register({ ...data, hcaptcha_token: '' })
      setUserId(res.data.user_id)
      setEmailMasque(res.data.email_masque)
      setStep('otp')
      toast.success('Code envoyé ! Vérifiez votre boîte mail.')
    } catch (e) {
      const errs = e.response?.data?.errors
      if (errs) {
        Object.values(errs).flat().forEach(msg => toast.error(msg))
      } else {
        toast.error(e.response?.data?.message || 'Erreur lors de la création du compte.')
      }
    }
  }

  // ── Vérification du code OTP ─────────────────────────────────────────────
  const onVerifyOtp = async () => {
    if (otp.length !== 6) { toast.error('Entrez les 6 chiffres du code.'); return }
    setOtpLoading(true)
    try {
      const res = await authApi.verifyOtp({ user_id: userId, otp })
      loginFromToken(res.data)
      toast.success('E-mail vérifié ! Bienvenue sur Reservia Bénin.')
      navigate('/')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Code incorrect.')
    } finally {
      setOtpLoading(false)
    }
  }

  // ── Renvoi du code OTP ───────────────────────────────────────────────────
  const onResend = async () => {
    try {
      await authApi.resendOtp({ user_id: userId })
      toast.success('Nouveau code envoyé !')
      setResendCooldown(60)
      const interval = setInterval(() => {
        setResendCooldown(c => { if (c <= 1) { clearInterval(interval); return 0 } return c - 1 })
      }, 1000)
    } catch (e) {
      toast.error(e.response?.data?.message || 'Impossible de renvoyer le code.')
    }
  }

  // ── Écran de vérification OTP ────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-sand px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

            {/* Header */}
            <div className="bg-gradient-to-br from-dark to-dark/80 p-8 text-center">
              <div className="w-16 h-16 bg-terracotta/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-terracotta" size={28} />
              </div>
              <h1 className="font-display text-2xl text-white mb-2">Vérifiez votre e-mail</h1>
              <p className="text-earth/70 text-sm">
                Un code à 6 chiffres a été envoyé à<br />
                <strong className="text-earth">{emailMasque}</strong>
              </p>
            </div>

            <div className="p-8 space-y-6">
              {/* OTP input */}
              <div>
                <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-3">
                  Code de vérification
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full text-center text-4xl font-mono font-bold tracking-[12px] py-4
                    border-2 border-earth/20 rounded-2xl focus:outline-none focus:border-dark
                    bg-sand/30 transition-colors"
                />
                <p className="text-earth/60 text-xs mt-2 text-center">
                  Le code expire dans 15 minutes
                </p>
              </div>

              <button
                onClick={onVerifyOtp}
                disabled={otpLoading || otp.length !== 6}
                className="w-full bg-terracotta text-white rounded-2xl py-4 font-semibold text-base
                  flex items-center justify-center gap-2 hover:bg-terracotta/90 transition-colors
                  disabled:opacity-50">
                {otpLoading
                  ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Vérification…</>
                  : <><FaCheckCircle size={16} /> Vérifier mon e-mail</>}
              </button>

              {/* Resend */}
              <div className="text-center">
                <p className="text-earth text-sm mb-2">Vous n'avez pas reçu le code ?</p>
                <button
                  onClick={onResend}
                  disabled={resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 text-terracotta font-semibold text-sm
                    hover:underline disabled:opacity-40 disabled:cursor-not-allowed transition">
                  <FaRedo size={11} />
                  {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
                </button>
              </div>

              <button
                onClick={() => setStep('form')}
                className="w-full text-earth text-sm hover:text-dark transition-colors">
                ← Modifier mon adresse e-mail
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Formulaire d'inscription ─────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand px-4 py-8">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="font-display text-4xl text-dark mb-2">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <p className="text-earth">Créez votre compte gratuitement</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: 'prenom', label: 'Prénom', placeholder: 'Kofi' },
                { name: 'nom',    label: 'Nom',    placeholder: 'Mensah' },
              ].map(({ name, label, placeholder }) => (
                <div key={name}>
                  <label className="form-label">{label} *</label>
                  <div className={`flex items-center border-2 rounded-xl px-3 py-2.5 gap-2 transition-colors
                    ${errors[name] ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark'}`}>
                    <FaUser className="text-earth/50 flex-shrink-0" size={12} />
                    <input className="flex-1 bg-transparent text-sm focus:outline-none"
                      placeholder={placeholder}
                      {...register(name, { required: 'Requis', minLength: { value: 2, message: 'Min. 2 car.' } })} />
                  </div>
                  {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>}
                </div>
              ))}
            </div>

            <div>
              <label className="form-label">Adresse e-mail *</label>
              <div className={`flex items-center border-2 rounded-xl px-3 py-2.5 gap-2 transition-colors
                ${errors.email ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark'}`}>
                <FaEnvelope className="text-earth/50 flex-shrink-0" size={12} />
                <input type="email" className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="kofi.mensah@email.com"
                  {...register('email', {
                    required: 'E-mail requis',
                    pattern: { value: /\S+@\S+\.\S+/, message: 'E-mail invalide' },
                  })} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="form-label">Téléphone 🇧🇯</label>
              <div className="flex items-center border-2 border-earth/20 rounded-xl overflow-hidden
                focus-within:border-dark transition-colors">
                <div className="px-3 py-2.5 bg-sand/50 border-r border-earth/20 text-sm font-bold text-dark flex-shrink-0">
                  +229
                </div>
                <div className="flex items-center flex-1 px-3 py-2.5 gap-2">
                  <FaPhone className="text-earth/50 flex-shrink-0" size={12} />
                  <input type="tel" className="flex-1 bg-transparent text-sm focus:outline-none font-mono"
                    placeholder="01 XX XX XX XX"
                    {...register('telephone')} />
                </div>
              </div>
            </div>

            <div>
              <label className="form-label">Mot de passe *</label>
              <div className={`flex items-center border-2 rounded-xl px-3 py-2.5 gap-2 transition-colors
                ${errors.password ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark'}`}>
                <FaLock className="text-earth/50 flex-shrink-0" size={12} />
                <input type="password" className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="Min. 12 car. avec majuscule et chiffre"
                  {...register('password', {
                    required: 'Requis',
                    minLength: { value: 12, message: '12 caractères minimum' },
                    pattern: { value: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, message: 'Majuscule, minuscule et chiffre requis' },
                  })} />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <div>
              <label className="form-label">Confirmer le mot de passe *</label>
              <div className={`flex items-center border-2 rounded-xl px-3 py-2.5 gap-2 transition-colors
                ${errors.password_confirmation ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark'}`}>
                <FaLock className="text-earth/50 flex-shrink-0" size={12} />
                <input type="password" className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="Retapez votre mot de passe"
                  {...register('password_confirmation', {
                    required: 'Requis',
                    validate: v => v === watch('password') || 'Les mots de passe ne correspondent pas',
                  })} />
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-xs mt-1">{errors.password_confirmation.message}</p>
              )}
            </div>

            {/* Conditions */}
            <div className="flex items-start gap-3">
              <input type="checkbox" id="accepte_conditions"
                className="mt-1 w-4 h-4 accent-terracotta cursor-pointer flex-shrink-0"
                {...register('accepte_conditions', { required: 'Vous devez accepter les conditions' })} />
              <label htmlFor="accepte_conditions" className="text-sm text-earth cursor-pointer leading-snug">
                J'accepte les{' '}
                <Link to="/cgu" target="_blank" className="text-terracotta underline">conditions d'utilisation</Link>
                {' '}et la{' '}
                <Link to="/confidentialite" target="_blank" className="text-terracotta underline">politique de confidentialité</Link>
              </label>
            </div>
            {errors.accepte_conditions && (
              <p className="text-red-500 text-xs -mt-2">{errors.accepte_conditions.message}</p>
            )}

            {/* Honeypot anti-bot (hidden) */}
            <input
              type="text"
              {...register('_trap')}
              style={{ display: 'none' }}
              tabIndex={-1}
              autoComplete="off"
            />

            <button type="submit"
              disabled={isSubmitting}
              className="w-full bg-terracotta text-white rounded-2xl py-4 font-semibold text-base
                flex items-center justify-center gap-2 hover:bg-terracotta/90 transition-colors
                disabled:opacity-50">
              {isSubmitting
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Création…</>
                : <>Créer mon compte <FaArrowRight size={14} /></>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-earth text-sm">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-terracotta font-medium hover:underline">Se connecter</Link>
            </p>
          </div>

          <div className="mt-5 pt-5 border-t border-earth/10 text-center">
            <p className="text-earth/60 text-xs mb-2">Vous représentez une entreprise ?</p>
            <Link to="/partenaires"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-dark hover:text-terracotta transition-colors">
              Devenir partenaire <FaArrowRight size={11} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
