import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaChartBar, FaBuilding, FaTicketAlt, FaClipboardList,
  FaArrowLeft, FaSignOutAlt, FaUserTie, FaBars, FaTimes,
} from 'react-icons/fa'

export default function HostLayout({ children, title }) {
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const isHebergement = user?.type_activite === 'hebergement'
  const isEvenement   = user?.type_activite === 'evenement'

  const NAV = [
    { path: '/host',              icon: FaChartBar,      label: 'Tableau de bord' },
    isHebergement && { path: '/host/hebergements', icon: FaBuilding,      label: 'Hébergements' },
    isEvenement   && { path: '/host/evenements',   icon: FaTicketAlt,     label: 'Événements'   },
    { path: '/host/reservations', icon: FaClipboardList, label: 'Réservations'  },
  ].filter(Boolean)

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnecté')
    navigate('/')
  }

  const isActive = (path) =>
    path === '/host' ? location.pathname === path : location.pathname.startsWith(path)

  /* ─── sidebar nav items (partagés desktop + mobile) ─── */
  const navItems = NAV.map(({ path, icon: Icon, label }) => {
    const active = isActive(path)
    return (
      <Link key={path} to={path} onClick={() => setOpen(false)}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
          ${active
            ? 'bg-terracotta text-white shadow-md shadow-terracotta/20'
            : 'text-white/55 hover:text-white hover:bg-white/8'
          }`}>
        <Icon size={15} className={active ? 'text-white' : 'text-white/40 group-hover:text-white/70'} />
        {label}
      </Link>
    )
  })

  const footerLinks = (
    <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
      {user && (
        <div className="px-4 py-2 mb-2">
          <p className="text-xs text-white/30 uppercase tracking-wider">Connecté en tant que</p>
          <p className="text-sm text-white/70 font-medium truncate mt-0.5">{user.prenom} {user.nom}</p>
        </div>
      )}
      <Link to="/" onClick={() => setOpen(false)}
        className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/8 transition-all">
        <FaArrowLeft size={13} /> Retour au site
      </Link>
      <button onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
        <FaSignOutAlt size={13} /> Déconnexion
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar desktop (md+) ── */}
      <aside className="hidden md:flex flex-col w-64 bg-dark fixed h-full z-20 shadow-xl">
        <div className="px-6 py-5 border-b border-white/10">
          <div className="font-display text-xl text-sand">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <FaUserTie size={10} className="text-terracotta" />
            <span className="text-xs text-white/40 tracking-widest uppercase">Espace Partenaire</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">{navItems}</nav>
        {footerLinks}
      </aside>

      {/* ── Overlay + sidebar mobile ── */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          {/* panneau */}
          <aside className="relative w-72 bg-dark flex flex-col h-full shadow-2xl z-50">
            <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <div className="font-display text-xl text-sand">
                  Réser<span className="text-terracotta italic">via</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <FaUserTie size={10} className="text-terracotta" />
                  <span className="text-xs text-white/40 tracking-widest uppercase">Espace Partenaire</span>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-white/50 hover:text-white p-1">
                <FaTimes size={20} />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">{navItems}</nav>
            {footerLinks}
          </aside>
        </div>
      )}

      {/* ── Contenu principal ── */}
      <div className="flex-1 min-w-0 md:ml-64">
        <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 sticky top-0 z-30 shadow-sm flex items-center gap-3">
          <button onClick={() => setOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-dark flex-shrink-0">
            <FaBars size={20} />
          </button>
          <h1 className="font-display text-xl md:text-2xl text-dark font-light">{title}</h1>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
