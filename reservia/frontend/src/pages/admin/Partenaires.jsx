import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { candidatureApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import toast from 'react-hot-toast'
import {
  FaHandshake, FaClock, FaCheckCircle, FaTimesCircle,
  FaBuilding, FaTicketAlt, FaEnvelope, FaPhone, FaMapMarkerAlt,
  FaCheck, FaTimes, FaFilter,
} from 'react-icons/fa'

const STATUT_CONFIG = {
  en_attente: { label: 'En attente',  color: 'bg-amber-100 text-amber-700',  icon: FaClock        },
  approuvée:  { label: 'Approuvée',   color: 'bg-green-100 text-green-700',  icon: FaCheckCircle  },
  rejetée:    { label: 'Rejetée',     color: 'bg-red-100 text-red-600',      icon: FaTimesCircle  },
}

const ACTIVITE_CONFIG = {
  hebergement: { label: 'Hébergement', icon: FaBuilding,   color: 'bg-blue-50 text-blue-700'   },
  evenement:   { label: 'Événement',   icon: FaTicketAlt,  color: 'bg-purple-50 text-purple-700'},
  restaurant:  { label: 'Restaurant',  icon: FaBuilding,   color: 'bg-orange-50 text-orange-700'},
  autre:       { label: 'Autre',       icon: FaBuilding,   color: 'bg-gray-50 text-gray-600'   },
}

export default function AdminPartenaires() {
  const [filtreStatut, setFiltreStatut] = useState('')
  const [confirmId, setConfirmId]       = useState(null)
  const [confirmType, setConfirmType]   = useState(null) // 'approuver' | 'rejeter'
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-candidatures', filtreStatut],
    queryFn:  () => candidatureApi.liste(filtreStatut ? { statut: filtreStatut } : {}),
  })

  const candidatures = data?.data?.data || []
  const total        = data?.data?.total || 0

  const approuverMutation = useMutation({
    mutationFn: (id) => candidatureApi.approuver(id),
    onSuccess:  () => {
      toast.success('Candidature approuvée — e-mail envoyé au partenaire')
      queryClient.invalidateQueries(['admin-candidatures'])
      setConfirmId(null)
    },
    onError: () => toast.error('Erreur lors de l\'approbation'),
  })

  const rejeterMutation = useMutation({
    mutationFn: (id) => candidatureApi.rejeter(id),
    onSuccess:  () => {
      toast.success('Candidature rejetée')
      queryClient.invalidateQueries(['admin-candidatures'])
      setConfirmId(null)
    },
    onError: () => toast.error('Erreur lors du rejet'),
  })

  const enAttente  = candidatures.filter(c => c.statut === 'en_attente').length
  const approuvees = candidatures.filter(c => c.statut === 'approuvée').length
  const rejetees   = candidatures.filter(c => c.statut === 'rejetée').length

  return (
    <AdminLayout title="Candidatures partenaires">
      {/* ── Statistiques ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'En attente',  value: enAttente,  color: 'text-amber-600', bg: 'bg-amber-50',  icon: FaClock       },
          { label: 'Approuvées',  value: approuvees, color: 'text-green-600', bg: 'bg-green-50',  icon: FaCheckCircle },
          { label: 'Rejetées',    value: rejetees,   color: 'text-red-500',   bg: 'bg-red-50',    icon: FaTimesCircle },
        ].map(({ label, value, color, bg, icon: Icon }) => (
          <div key={label} className={`${bg} rounded-2xl px-6 py-4 flex items-center gap-4`}>
            <Icon className={color} size={22} />
            <div>
              <div className={`text-2xl font-display font-semibold ${color}`}>{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filtres ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex items-center gap-3 flex-wrap">
        <FaFilter size={13} className="text-gray-400" />
        <span className="text-sm text-gray-500 font-medium">Filtrer :</span>
        {['', 'en_attente', 'approuvée', 'rejetée'].map(s => (
          <button key={s} onClick={() => setFiltreStatut(s)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all border ${
              filtreStatut === s
                ? 'bg-dark text-white border-dark'
                : 'bg-white text-earth border-earth/30 hover:border-dark/40'
            }`}>
            {s === '' ? 'Toutes' : STATUT_CONFIG[s]?.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400">{total} candidature{total > 1 ? 's' : ''}</span>
      </div>

      {/* ── Liste ── */}
      {isLoading ? (
        <div className="grid gap-4">
          {[1,2,3].map(i => <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : candidatures.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <FaHandshake size={36} className="text-gray-200 mx-auto mb-4" />
          <p className="text-gray-400 font-display text-xl">Aucune candidature</p>
          <p className="text-gray-400/60 text-sm mt-1">Les nouvelles candidatures apparaîtront ici</p>
        </div>
      ) : (
        <div className="space-y-4">
          {candidatures.map(c => {
            const activite = ACTIVITE_CONFIG[c.type_activite] || ACTIVITE_CONFIG.autre
            const statut   = STATUT_CONFIG[c.statut] || STATUT_CONFIG.en_attente
            const StatutIcon   = statut.icon
            const ActiviteIcon = activite.icon

            return (
              <div key={c.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h3 className="font-semibold text-dark text-base">{c.nom_etablissement}</h3>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${activite.color}`}>
                        <ActiviteIcon size={10} /> {activite.label}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${statut.color}`}>
                        <StatutIcon size={10} /> {statut.label}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {c.prenom_responsable} {c.nom_responsable}
                    </p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><FaEnvelope size={10} /> {c.email}</span>
                      <span className="flex items-center gap-1"><FaPhone size={10} /> +229 {c.telephone}</span>
                      <span className="flex items-center gap-1"><FaMapMarkerAlt size={10} /> {c.ville}</span>
                      <span className="text-gray-300">
                        {new Date(c.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </span>
                    </div>
                    {c.message && (
                      <p className="mt-2 text-xs text-gray-500 italic line-clamp-2 border-l-2 border-gray-100 pl-3">
                        {c.message}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  {c.statut === 'en_attente' && (
                    <div className="flex gap-2 flex-shrink-0">
                      {confirmId === c.id && confirmType === 'approuver' ? (
                        <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
                          <span className="text-xs text-green-700 font-medium">Confirmer ?</span>
                          <button onClick={() => approuverMutation.mutate(c.id)}
                            disabled={approuverMutation.isPending}
                            className="text-xs bg-green-500 text-white px-2.5 py-1 rounded-lg hover:bg-green-600 transition-colors">
                            Oui
                          </button>
                          <button onClick={() => setConfirmId(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-1">
                            Non
                          </button>
                        </div>
                      ) : confirmId === c.id && confirmType === 'rejeter' ? (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                          <span className="text-xs text-red-600 font-medium">Rejeter ?</span>
                          <button onClick={() => rejeterMutation.mutate(c.id)}
                            disabled={rejeterMutation.isPending}
                            className="text-xs bg-red-500 text-white px-2.5 py-1 rounded-lg hover:bg-red-600 transition-colors">
                            Oui
                          </button>
                          <button onClick={() => setConfirmId(null)}
                            className="text-xs text-gray-400 hover:text-gray-600 px-1">
                            Non
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => { setConfirmId(c.id); setConfirmType('approuver') }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-xl text-xs font-medium hover:bg-green-100 transition-colors">
                            <FaCheck size={10} /> Approuver
                          </button>
                          <button
                            onClick={() => { setConfirmId(c.id); setConfirmType('rejeter') }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-medium hover:bg-red-100 transition-colors">
                            <FaTimes size={10} /> Rejeter
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </AdminLayout>
  )
}
