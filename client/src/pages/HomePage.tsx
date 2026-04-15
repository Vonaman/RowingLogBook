import { useNavigate } from 'react-router-dom'

const features = [
  {
    title: 'Gestion des sorties',
    desc: 'Enregistrez chaque sortie en temps réel — départ, retour, distance et équipage.',
  },
  {
    title: 'Flotte de bateaux',
    desc: 'Suivez la disponibilité et l\'état de chaque bateau du club.',
  },
  {
    title: 'Statistiques',
    desc: 'Visualisez les performances individuelles et collectives sur la saison.',
  },
  {
    title: 'Alertes de sécurité',
    desc: 'Soyez notifié immédiatement si une sortie dépasse le temps prévu.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800/80">
        <span className="text-xl font-bold tracking-tight text-cyan-300">RowingLogBook</span>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-800 text-slate-200 hover:bg-slate-700 transition"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-violet-500 hover:bg-violet-400 text-white transition"
          >
            Créer un compte
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative flex-1 overflow-hidden px-6 py-24">
        <div className="absolute -top-28 right-1/4 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-start gap-6 text-left">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight leading-tight max-w-3xl">
              Gardez le cap
              <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-violet-400 bg-clip-text text-transparent">
                sur chaque sortie
              </span>
            </h1>

            <p className="text-lg text-slate-300 max-w-2xl leading-relaxed">
              RowingLogBook centralise la gestion des sorties, des bateaux et des membres
              de votre club d'aviron. Planifiez mieux, suivez les performances et sécurisez les sessions
              sur une seule plateforme.
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Sessions ce mois-ci</p>
                <p className="mt-1 text-2xl font-bold text-cyan-300">284</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-4 py-3">
                <p className="text-xs uppercase tracking-wide text-slate-400">Bateaux disponibles</p>
                <p className="mt-1 text-2xl font-bold text-violet-300">18</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-3.5 rounded-xl font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-base transition shadow-lg shadow-cyan-500/20"
              >
                Commencer gratuitement
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3.5 rounded-xl font-semibold bg-violet-500/20 border border-violet-300/40 hover:bg-violet-500/30 text-violet-100 text-base transition"
              >
                Se connecter
              </button>
            </div>
          </div>

          <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/50">
            <h2 className="text-lg font-semibold text-white">Vue rapide de l activité</h2>
            <p className="mt-1 text-sm text-slate-400">
              Une synthèse claire des indicateurs essentiels pour votre staff.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Objectif hebdomadaire</span>
                  <span className="text-cyan-300">72%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 w-[72%] rounded-full bg-cyan-400" />
                </div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="text-slate-300">Séances validées</span>
                  <span className="text-violet-300">46 / 60</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800">
                  <div className="h-2 w-[76%] rounded-full bg-violet-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 transition"
            >
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} RowingLogBook — Plateforme de suivi du club
      </footer>
    </div>
  )
}
