import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FaChartBar, FaClipboardList, FaBuilding, FaTicketAlt,
  FaUsers, FaHandshake, FaArrowLeft, FaSignOutAlt, FaUserShield,
  FaBars, FaTimes,
} from 'react-icons/fa'

const NAV = [
  { path: '/admin',              icon: FaChartBar,      label: 'Dashboard'    },
  { path: '/admin/reservations', icon: FaClipboardList, label: 'Réservations' },
  { path: '/admin/hebergements', icon: FaBuilding,      label: 'Hébergements' },
  { path: '/admin/evenements',   icon: FaTicketAlt,     label: 'Événements'   },
  { path: '/admin/utilisateurs', icon: FaUsers,         label: 'Utilisateurs' },
  { path: '/admin/partenaires',  icon: FaHandshake,     label: 'Partenaires'  },
]

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Déconnecté')
    navigate('/')
  }

  const isActive = (path) =>
    path === '/admin' ? location.pathname === path : location.pathname.startsWith(path)

  const closeSidebar = () => setSidebarOpen(false)

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div>
          <div className="font-display text-xl text-sand">
            Réser<span className="text-terracotta italic">via</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <FaUserShield size={10} className="text-terracotta" />
            <span className="text-xs text-white/40 tracking-widest uppercase">Administration</span>
          </div>
        </div>
        <button onClick={closeSidebar}
          className="md:hidden text-white/40 hover:text-white transition-colors p-1">
          <FaTimes size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ path, icon: Icon, label }) => {
          const active = isActive(path)
          return (
            <Link key={path} to={path} onClick={closeSidebar}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
                ${active
                  ? 'bg-terracotta text-white shadow-md shadow-terracotta/20'
                  : 'text-white/55 hover:text-white hover:bg-white/8'
                }`}>
              <Icon size={15} className={active ? 'text-white' : 'text-white/40 group-hover:text-white/70'} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        {user && (
          <div className="px-4 py-2 mb-2">
            <p className="text-xs text-white/30 uppercase tracking-wider">Connecté en tant que</p>
            <p className="text-sm text-white/70 font-medium truncate mt-0.5">{user.prenom} {user.nom}</p>
          </div>
        )}
        <Link to="/" onClick={closeSidebar}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-white/55 hover:text-white hover:bg-white/8 transition-all">
          <FaArrowLeft size={13} />
          Retour au site
        </Link>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all">
          <FaSignOutAlt size={13} />
          Déconnexion
        </button>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* ── Sidebar desktop ── */}
      <aside className="hidden md:flex w-64 bg-dark flex-col fixed h-full z-20 shadow-xl">
        <SidebarContent />
      </aside>

      {/* ── Sidebar mobile (overlay) ── */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={closeSidebar}
          />
          <aside className="fixed left-0 top-0 h-full w-72 bg-dark flex flex-col z-30 shadow-2xl md:hidden">
            <SidebarContent />
          </aside>
        </>
      )}

      {/* ── Main ── */}
      <div className="flex-1 min-w-0 md:ml-64">
        <header className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 sticky top-0 z-10 shadow-sm flex items-center gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors text-dark">
            <FaBars size={18} />
          </button>
          <h1 className="font-display text-xl md:text-2xl text-dark font-light">{title}</h1>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  )
}
