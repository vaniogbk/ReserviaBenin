import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../context/AuthContext'
import { authApi } from '../../services/api'
import toast from 'react-hot-toast'
import { FaEnvelope, FaLock, FaArrowRight, FaCheckCircle, FaRedo } from 'react-icons/fa'

export default function Login() {
  const { loginFromToken } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  // 'form' | 'otp'
  const [step, setStep]               = useState('form')
  const [userId, setUserId]           = useState(null)
  const [emailMasque, setEmailMasque] = useState('')
  const [otp, setOtp]                 = useState('')
  const [otpLoading, setOtpLoading]   = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const onSubmit = async (data) => {
    try {
      const res = await authApi.login(data)
      if (res.data.requires_verification) {
        setUserId(res.data.user_id)
        setEmailMasque(res.data.email_masque)
        setStep('otp')
        toast('Un code de vérification a été envoyé à votre adresse e-mail.', { icon: '📧' })
        return
      }
      loginFromToken(res.data)
      toast.success('Bienvenue !')
      navigate(from, { replace: true })
    } catch (e) {
      const msg = e.response?.data?.message || 'E-mail ou mot de passe incorrect.'
      toast.error(msg)
    }
  }

  const onVerifyOtp = async () => {
    if (otp.length !== 6) { toast.error('Entrez les 6 chiffres du code.'); return }
    setOtpLoading(true)
    try {
      const res = await authApi.verifyOtp({ user_id: userId, otp })
      loginFromToken(res.data)
      toast.success('E-mail vérifié ! Bienvenue.')
      navigate(from, { replace: true })
    } catch (e) {
      toast.error(e.response?.data?.message || 'Code incorrect.')
    } finally {
      setOtpLoading(false)
    }
  }

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

  // ── Écran OTP ────────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center bg-sand px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="bg-gradient-to-br from-dark to-dark/80 p-8 text-center">
              <div className="w-16 h-16 bg-terracotta/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FaEnvelope className="text-terracotta" size={28} />
              </div>
              <h1 className="font-display text-2xl text-white mb-2">Vérification requise</h1>
              <p className="text-earth/70 text-sm">
                Code envoyé à <strong className="text-earth">{emailMasque}</strong>
              </p>
            </div>
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-3">
                  Code à 6 chiffres
                </label>
                <input
                  type="text" inputMode="numeric" maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full text-center text-4xl font-mono font-bold tracking-[12px] py-4
                    border-2 border-earth/20 rounded-2xl focus:outline-none focus:border-dark
                    bg-sand/30 transition-colors"
                />
              </div>
              <button onClick={onVerifyOtp} disabled={otpLoading || otp.length !== 6}
                className="w-full bg-terracotta text-white rounded-2xl py-4 font-semibold
                  flex items-center justify-center gap-2 hover:bg-terracotta/90 transition-colors
                  disabled:opacity-50">
                {otpLoading
                  ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Vérification…</>
                  : <><FaCheckCircle size={15} /> Confirmer</>}
              </button>
              <div className="text-center space-y-2">
                <button onClick={onResend} disabled={resendCooldown > 0}
                  className="inline-flex items-center gap-1.5 text-terracotta text-sm font-semibold
                    hover:underline disabled:opacity-40 transition">
                  <FaRedo size={10} />
                  {resendCooldown > 0 ? `Renvoyer dans ${resendCooldown}s` : 'Renvoyer le code'}
                </button>
                <br />
                <button onClick={() => setStep('form')} className="text-earth text-sm hover:text-dark transition">
                  ← Retour à la connexion
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Formulaire de connexion ──────────────────────────────────────────────
  return (
    <div className="min-h-screen pt-16 flex items-center justify-center bg-sand px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="font-display text-4xl text-dark mb-2">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <p className="text-earth">Connectez-vous à votre compte</p>
        </div>
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="form-label">Adresse e-mail</label>
              <div className={`flex items-center border-2 rounded-xl px-3 py-2.5 gap-2 transition-colors
                ${errors.email ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark'}`}>
                <FaEnvelope className="text-earth/50 flex-shrink-0" size={12} />
                <input type="email" autoComplete="email"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="kofi.mensah@email.com"
                  {...register('email', { required: 'E-mail requis' })} />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="form-label">Mot de passe</label>
              <div className={`flex items-center border-2 rounded-xl px-3 py-2.5 gap-2 transition-colors
                ${errors.password ? 'border-red-400 bg-red-50' : 'border-earth/20 focus-within:border-dark'}`}>
                <FaLock className="text-earth/50 flex-shrink-0" size={12} />
                <input type="password" autoComplete="current-password"
                  className="flex-1 bg-transparent text-sm focus:outline-none"
                  placeholder="••••••••"
                  {...register('password', { required: 'Mot de passe requis' })} />
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full bg-terracotta text-white rounded-2xl py-4 font-semibold text-base
                flex items-center justify-center gap-2 hover:bg-terracotta/90 transition-colors
                disabled:opacity-50">
              {isSubmitting
                ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Connexion…</>
                : <>Se connecter <FaArrowRight size={14} /></>}
            </button>
          </form>
          <div className="mt-6 text-center space-y-2">
            <p className="text-earth text-sm">
              Pas encore de compte ?{' '}
              <Link to="/register" className="text-terracotta font-medium hover:underline">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
