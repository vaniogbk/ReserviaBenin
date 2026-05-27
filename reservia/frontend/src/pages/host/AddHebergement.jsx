import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hostApi } from '../../services/api'
import HostLayout from '../../components/layout/HostLayout'
import toast from 'react-hot-toast'
import { FaBuilding, FaArrowLeft } from 'react-icons/fa'

const TYPES = [
  { value: 'hotel',    label: 'Hôtel'        },
  { value: 'ecolodge', label: 'Écolodge'     },
  { value: 'gite',     label: 'Gîte'         },
  { value: 'villa',    label: 'Villa'        },
  { value: 'auberge',  label: 'Auberge'      },
]

const AMENAGEMENTS_OPTIONS = [
  'Piscine', 'Wifi', 'Parking', 'Climatisation', 'Petit-déjeuner inclus',
  'Salle de sport', 'Jacuzzi', 'Terrasse', 'Vue mer', 'Accès plage',
]

const Field = ({ label, error, children }) => (
  <div>
    <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-2">
      {label}
    </label>
    {children}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
)

const inputCls = (err) =>
  `w-full px-4 py-3 border-2 rounded-2xl text-sm focus:outline-none transition-colors bg-gray-50 ${
    err ? 'border-red-400' : 'border-gray-200 focus:border-dark'
  }`

export default function AddHebergement() {
  const navigate     = useNavigate()
  const queryClient  = useQueryClient()
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm()

  const amenagements = watch('amenagements') || []

  const toggleAmenagement = (a) => {
    const current = amenagements.includes(a)
      ? amenagements.filter(x => x !== a)
      : [...amenagements, a]
    setValue('amenagements', current)
  }

  const mutation = useMutation({
    mutationFn: (data) => hostApi.creerHebergement({ ...data, amenagements }),
    onSuccess: () => {
      toast.success('Hébergement ajouté avec succès !')
      queryClient.invalidateQueries(['host-hebergements'])
      navigate('/host/hebergements')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur lors de la création'),
  })

  return (
    <HostLayout title="Ajouter un hébergement">
      <div className="max-w-2xl mx-auto">

        <button onClick={() => navigate('/host/hebergements')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark mb-6 transition-colors">
          <FaArrowLeft size={12} /> Retour à mes hébergements
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-terracotta/10 rounded-2xl flex items-center justify-center">
              <FaBuilding className="text-terracotta" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-dark text-lg">Nouvel hébergement</h2>
              <p className="text-sm text-gray-500">Remplissez les informations de base</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-5">

            <Field label="Titre *" error={errors.titre?.message}>
              <input {...register('titre', { required: 'Requis' })}
                className={inputCls(errors.titre)}
                placeholder="Ex : Villa Beau Rivage" />
            </Field>

            <Field label="Type d'hébergement *" error={errors.type?.message}>
              <select {...register('type', { required: 'Requis' })} className={inputCls(errors.type)}>
                <option value="">Sélectionnez un type</option>
                {TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </Field>

            <Field label="Description *" error={errors.description?.message}>
              <textarea {...register('description', { required: 'Requis', minLength: { value: 30, message: 'Min. 30 caractères' } })}
                rows={4} className={inputCls(errors.description)}
                placeholder="Décrivez votre hébergement…" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Ville *" error={errors.ville?.message}>
                <input {...register('ville', { required: 'Requis' })}
                  className={inputCls(errors.ville)} placeholder="Cotonou" />
              </Field>
              <Field label="Adresse" error={errors.adresse?.message}>
                <input {...register('adresse')}
                  className={inputCls(errors.adresse)} placeholder="Quartier, rue…" />
              </Field>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Field label="Prix / nuit (FCFA) *" error={errors.prix_par_nuit?.message}>
                <input type="number" {...register('prix_par_nuit', { required: 'Requis', min: { value: 1, message: '> 0' } })}
                  className={inputCls(errors.prix_par_nuit)} placeholder="25000" />
              </Field>
              <Field label="Capacité max" error={errors.capacite_max?.message}>
                <input type="number" {...register('capacite_max', { min: { value: 1, message: '≥ 1' } })}
                  className={inputCls(errors.capacite_max)} placeholder="4" />
              </Field>
              <Field label="Pièces" error={errors.nombre_pieces?.message}>
                <input type="number" {...register('nombre_pieces')}
                  className={inputCls(errors.nombre_pieces)} placeholder="3" />
              </Field>
              <Field label="Lits" error={errors.nombre_lits?.message}>
                <input type="number" {...register('nombre_lits')}
                  className={inputCls(errors.nombre_lits)} placeholder="2" />
              </Field>
            </div>

            {/* Aménagements */}
            <div>
              <label className="block text-xs font-semibold text-earth uppercase tracking-wider mb-3">
                Équipements disponibles
              </label>
              <div className="flex flex-wrap gap-2">
                {AMENAGEMENTS_OPTIONS.map(a => (
                  <button key={a} type="button" onClick={() => toggleAmenagement(a)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      amenagements.includes(a)
                        ? 'bg-terracotta text-white border-terracotta'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-terracotta/50'
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button type="submit" disabled={isSubmitting || mutation.isPending}
                className="w-full bg-terracotta text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-terracotta/90 transition-colors disabled:opacity-50">
                {mutation.isPending
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement…</>
                  : <><FaBuilding size={14} /> Ajouter l'hébergement</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </HostLayout>
  )
}
