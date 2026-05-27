import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { adminApi } from '../../services/api'
import AdminLayout from '../../components/layout/AdminLayout'
import StatutBadge from '../../components/ui/StatutBadge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import {
  FaMoneyBillWave, FaClipboardList, FaStar, FaUsers,
  FaArrowRight, FaBuilding, FaTicketAlt,
} from 'react-icons/fa'

const KPI_CONFIG = [
  { key: 'revenus',      icon: FaMoneyBillWave, label: 'Revenus ce mois',       color: 'text-green-600',  bg: 'bg-green-50',  sub: '+12%',    subColor: 'text-green-600' },
  { key: 'reservations', icon: FaClipboardList, label: 'Réservations actives',   color: 'text-blue-600',   bg: 'bg-blue-50',   sub: 'en cours', subColor: 'text-blue-600'  },
  { key: 'note',         icon: FaStar,          label: 'Note moyenne',           color: 'text-amber-500',  bg: 'bg-amber-50',  sub: '/ 5',      subColor: 'text-amber-500' },
  { key: 'utilisateurs', icon: FaUsers,         label: 'Nouveaux utilisateurs',  color: 'text-purple-600', bg: 'bg-purple-50', sub: 'ce mois',  subColor: 'text-purple-600'},
]

export default function Dashboard() {
  const { data, isLoading } = useQuery({ queryKey: ['admin-dashboard'], queryFn: adminApi.dashboard })
  const d = data?.data
  const kpis = d?.kpis

  const kpiValues = {
    revenus:      kpis?.revenus_mois_fcfa ? `${kpis.revenus_mois_fcfa.toLocaleString('fr-FR')} FCFA` : '—',
    reservations: kpis?.reservations_actives ?? '—',
    note:         kpis?.note_moyenne ?? '—',
    utilisateurs: kpis?.utilisateurs_ce_mois ?? '—',
  }

  const chartData = d?.graphiques?.reservations_par_mois?.map(r => ({
    name: `M${r.mois}`, total: r.total,
  })) || []

  return (
    <AdminLayout title="Tableau de bord">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="h-28 rounded-2xl bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* ── KPIs ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            {KPI_CONFIG.map(({ key, icon: Icon, label, color, bg, sub, subColor }) => (
              <div key={key} className={`${bg} rounded-2xl px-6 py-5`}>
                <div className="flex items-center justify-between mb-3">
                  <Icon className={color} size={20} />
                  <span className={`text-xs font-semibold ${subColor}`}>{sub}</span>
                </div>
                <div className={`font-display text-2xl font-semibold ${color} mb-1`}>{kpiValues[key]}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* ── Graphique réservations ── */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-dark">Réservations par mois</h2>
                <FaClipboardList size={14} className="text-gray-300" />
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                    formatter={(v) => [`${v} réservations`]}
                  />
                  <Bar dataKey="total" fill="#C0533A" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* ── Répartition revenus ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-dark">Répartition revenus</h2>
                <FaMoneyBillWave size={14} className="text-gray-300" />
              </div>
              <div className="space-y-5">
                {d?.graphiques?.repartition_revenus?.map(r => {
                  const total = d.graphiques.repartition_revenus.reduce((a, x) => a + x.montant, 0)
                  const pct   = total ? Math.round((r.montant / total) * 100) : 0
                  return (
                    <div key={r.label}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-gray-600">{r.label}</span>
                        <span className="font-semibold text-dark">{pct}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-1.5 rounded-full bg-terracotta transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{r.montant?.toLocaleString('fr-FR')} FCFA</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── Dernières réservations ── */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-dark">Dernières réservations</h2>
              <Link to="/admin/reservations"
                className="flex items-center gap-1.5 text-sm text-terracotta font-medium hover:underline">
                Voir tout <FaArrowRight size={11} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                  <tr>
                    {['Référence', 'Client', 'Prestation', 'Montant', 'Statut'].map(h => (
                      <th key={h} className="px-6 py-3 text-left font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {d?.dernieres_reservations?.slice(0, 6).map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono text-sm text-terracotta font-semibold">{r.reference}</td>
                      <td className="px-6 py-4 text-sm text-dark">{r.user?.prenom} {r.user?.nom}</td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-[160px] truncate">{r.reservable?.nom}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-dark">{r.montant_total_fcfa?.toLocaleString('fr-FR')} F</td>
                      <td className="px-6 py-4"><StatutBadge statut={r.statut} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!d?.dernieres_reservations?.length && (
                <div className="text-center py-12 text-gray-400 text-sm">Aucune réservation pour le moment</div>
              )}
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  )
}
