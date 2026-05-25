import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { evenementApi } from '../services/api'
import EvenementCard from '../components/ui/EvenementCard'

const CATEGORIES = ['vodoun','gastronomie','culture','seminaire','nature','art']

export default function Evenements() {
  const [params, setParams] = useSearchParams()

  const filters = {
    categorie: params.get('categorie') || '',
    ville:     params.get('ville')     || '',
  }

  const { data, isLoading } = useQuery({
    queryKey: ['evenements', filters],
    queryFn: () => evenementApi.liste({ ...filters }),
  })

  const evenements = data?.data?.data || []

  const set = (k, v) => {
    const next = new URLSearchParams(params)
    if (v) next.set(k, v); else next.delete(k)
    setParams(next, { replace: true })
  }

  return (
    <div className="pt-16">
      <div className="bg-dark py-14 px-8">
        <h1 className="font-display text-5xl font-light text-white">Événements</h1>
        <p className="text-white/50 mt-2">85 expériences béninoises · Festivals, culture, gastronomie</p>
      </div>

      <div className="bg-white border-b border-earth/20 px-8 py-4 flex flex-wrap gap-3">
        <button onClick={() => set('categorie', '')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all
            ${!filters.categorie ? 'bg-dark text-white' : 'bg-sand text-earth hover:text-dark'}`}>
          Tous
        </button>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => set('categorie', c)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all capitalize
              ${filters.categorie === c ? 'bg-dark text-white' : 'bg-sand text-earth hover:text-dark'}`}>
            {c}
          </button>
        ))}
        <input className="form-input ml-auto w-44 py-2 px-3 text-sm" placeholder="Ville..."
          value={filters.ville} onChange={e => set('ville', e.target.value)} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <div key={i} className="rounded-2xl bg-sand h-72 animate-pulse" />)}
          </div>
        ) : evenements.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-earth font-display text-2xl">Aucun résultat trouvé</p>
            <p className="text-earth/60 mt-2">Essayez d'autres critères de recherche</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {evenements.map(e => <EvenementCard key={e.id} item={e} />)}
          </div>
        )}
      </div>
    </div>
  )
}
