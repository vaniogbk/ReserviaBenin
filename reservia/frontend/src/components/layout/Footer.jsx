import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaMapMarkerAlt, FaEnvelope, FaPhone, FaFacebookF,
  FaInstagram, FaTwitter, FaLinkedinIn, FaShieldAlt,
  FaMobileAlt, FaCreditCard
} from 'react-icons/fa'

const SOCIALS = [
  { icon: FaFacebookF,  href: 'https://facebook.com', label: 'Facebook' },
  { icon: FaInstagram,  href: 'https://instagram.com', label: 'Instagram' },
  { icon: FaTwitter,    href: 'https://twitter.com', label: 'Twitter' },
  { icon: FaLinkedinIn, href: 'https://linkedin.com', label: 'LinkedIn' },
]

export default function Footer() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const year = new Date().getFullYear()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnexion réussie')
    navigate('/')
  }

  return (
    <footer className="bg-dark text-white/70">
      {/* ── Bande principale ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Colonne 1 : Marque */}
        <div className="lg:col-span-1">
          <Link to="/" className="inline-block font-display text-2xl text-white mb-3">
            Réser<span className="text-terracotta italic">via</span>
            <span className="ml-1 text-xs font-sans font-normal text-earth tracking-wider">BÉNIN</span>
          </Link>
          <p className="text-sm leading-relaxed mb-5">
            La plateforme de référence pour réserver hébergements et événements au Bénin.
            12 départements couverts.
          </p>
          {/* Réseaux sociaux */}
          <div className="flex gap-3">
            {SOCIALS.map(({ icon: Icon, href, label }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                aria-label={label}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-terracotta flex items-center justify-center transition-colors">
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>

        {/* Colonne 2 : Navigation */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Navigation</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-sm hover:text-white transition-colors">Accueil</Link></li>
            <li><Link to="/hebergements" className="text-sm hover:text-white transition-colors">Hébergements</Link></li>
            <li><Link to="/evenements" className="text-sm hover:text-white transition-colors">Événements</Link></li>
            <li><Link to="/partenaires" className="text-sm hover:text-white transition-colors">Devenir partenaire</Link></li>
            {user ? (
              <li>
                <button onClick={handleLogout} className="text-sm hover:text-white transition-colors text-left">Déconnexion</button>
              </li>
            ) : (
              <>
                <li><Link to="/login" className="text-sm hover:text-white transition-colors">Connexion</Link></li>
                <li><Link to="/register" className="text-sm hover:text-white transition-colors">Créer un compte</Link></li>
              </>
            )}
          </ul>
        </div>

        {/* Colonne 3 : Contact */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <FaMapMarkerAlt className="text-terracotta mt-0.5 flex-shrink-0" size={14} />
              <span>Haie Vive, Cotonou<br />République du Bénin</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-terracotta flex-shrink-0" size={14} />
              <a href="mailto:contact@reservia-benin.com"
                className="hover:text-white transition-colors">contact@reservia-benin.com</a>
            </li>
            <li className="flex items-center gap-3">
              <FaPhone className="text-terracotta flex-shrink-0" size={14} />
              <a href="tel:+22961000000" className="hover:text-white transition-colors">+229 61 00 00 00</a>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : Paiements acceptés */}
        <div>
          <h3 className="text-white font-semibold text-sm tracking-widest uppercase mb-4">Paiements sécurisés</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <FaMobileAlt className="text-yellow-400" size={16} />
              <span className="text-sm">MTN MoMo</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <FaMobileAlt className="text-blue-400" size={16} />
              <span className="text-sm">Moov Money</span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
              <FaCreditCard className="text-earth" size={16} />
              <span className="text-sm">Carte Visa / Mastercard</span>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs">
              <FaShieldAlt className="text-green-400" size={12} />
              <span className="text-white/50">Chiffrement SSL · Paiement sécurisé</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bande légale ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/40">
          <span>© {year} Réservia Bénin — Tous droits réservés</span>
          <span>
            Fait par{' '}
            <a href="https://vanio.dev" target="_blank" rel="noopener noreferrer"
              className="hover:text-white transition-colors font-medium">Vanio.dev</a>
          </span>
          <div className="flex gap-4">
            <Link to="/mentions-legales" className="hover:text-white transition-colors">Mentions légales</Link>
            <Link to="/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link to="/cgu" className="hover:text-white transition-colors">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
