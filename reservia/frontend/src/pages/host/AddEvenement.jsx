import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hostApi } from '../../services/api'
import HostLayout from '../../components/layout/HostLayout'
import toast from 'react-hot-toast'
import { FaTicketAlt, FaArrowLeft } from 'react-icons/fa'

const CATEGORIES = [
  { value: 'vodoun',      label: 'Vodoun / Culturel traditionnel' },
  { value: 'gastronomie', label: 'Gastronomie'                   },
  { value: 'culture',     label: 'Culture & Arts'                },
  { value: 'seminaire',   label: 'Séminaire / Conférence'        },
  { value: 'nature',      label: 'Nature & Aventure'             },
  { value: 'art',         label: 'Art & Exposition'              },
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

export default function AddEvenement() {
  const navigate    = useNavigate()
  const queryClient = useQueryClient()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm()

  const mutation = useMutation({
    mutationFn: (data) => hostApi.creerEvenement(data),
    onSuccess: () => {
      toast.success('Événement ajouté avec succès !')
      queryClient.invalidateQueries(['host-evenements'])
      navigate('/host/evenements')
    },
    onError: (e) => toast.error(e.response?.data?.message || 'Erreur lors de la création'),
  })

  return (
    <HostLayout title="Ajouter un événement">
      <div className="max-w-2xl mx-auto">

        <button onClick={() => navigate('/host/evenements')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-dark mb-6 transition-colors">
          <FaArrowLeft size={12} /> Retour à mes événements
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center">
              <FaTicketAlt className="text-purple-500" size={20} />
            </div>
            <div>
              <h2 className="font-semibold text-dark text-lg">Nouvel événement</h2>
              <p className="text-sm text-gray-500">Remplissez les informations de base</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(data => mutation.mutate(data))} className="space-y-5">

            <Field label="Titre *" error={errors.titre?.message}>
              <input {...register('titre', { required: 'Requis' })}
                className={inputCls(errors.titre)}
                placeholder="Ex : Festival des Divinités Vodoun" />
            </Field>

            <Field label="Catégorie *" error={errors.categorie?.message}>
              <select {...register('categorie', { required: 'Requis' })} className={inputCls(errors.categorie)}>
                <option value="">Sélectionnez une catégorie</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>

            <Field label="Description *" error={errors.description?.message}>
              <textarea {...register('description', { required: 'Requis', minLength: { value: 30, message: 'Min. 30 caractères' } })}
                rows={4} className={inputCls(errors.description)}
                placeholder="Décrivez l'événement, le programme…" />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Lieu / Adresse *" error={errors.lieu?.message}>
                <input {...register('lieu', { required: 'Requis' })}
                  className={inputCls(errors.lieu)} placeholder="Place de l'étoile rouge" />
              </Field>
              <Field label="Ville *" error={errors.ville?.message}>
                <input {...register('ville', { required: 'Requis' })}
                  className={inputCls(errors.ville)} placeholder="Cotonou" />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Date de début *" error={errors.date_debut?.message}>
                <input type="datetime-local" {...register('date_debut', { required: 'Requis' })}
                  className={inputCls(errors.date_debut)} />
              </Field>
              <Field label="Date de fin *" error={errors.date_fin?.message}>
                <input type="datetime-local" {...register('date_fin', { required: 'Requis' })}
                  className={inputCls(errors.date_fin)} />
              </Field>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Prix d'entrée (FCFA) *" error={errors.prix_entree?.message}>
                <input type="number" {...register('prix_entree', { required: 'Requis', min: { value: 0, message: '≥ 0' } })}
                  className={inputCls(errors.prix_entree)} placeholder="5000" />
              </Field>
              <Field label="Nombre de places *" error={errors.nombre_places_total?.message}>
                <input type="number" {...register('nombre_places_total', { required: 'Requis', min: { value: 1, message: '≥ 1' } })}
                  className={inputCls(errors.nombre_places_total)} placeholder="200" />
              </Field>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button type="submit" disabled={isSubmitting || mutation.isPending}
                className="w-full bg-terracotta text-white rounded-2xl py-3.5 font-semibold flex items-center justify-center gap-2 hover:bg-terracotta/90 transition-colors disabled:opacity-50">
                {mutation.isPending
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Enregistrement…</>
                  : <><FaTicketAlt size={14} /> Publier l'événement</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </HostLayout>
  )
}
