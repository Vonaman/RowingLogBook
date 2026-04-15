import { useNavigate } from 'react-router-dom'

const features = [
  {
    icon: '🚣',
    title: 'Gestion des sorties',
    desc: 'Enregistrez chaque sortie en temps réel — départ, retour, distance et équipage.',
  },
  {
    icon: '⚓',
    title: 'Flotte de bateaux',
    desc: 'Suivez la disponibilité et l\'état de chaque bateau du club.',
  },
  {
    icon: '📊',
    title: 'Statistiques',
    desc: 'Visualisez les performances individuelles et collectives sur la saison.',
  },
  {
    icon: '🔔',
    title: 'Alertes de sécurité',
    desc: 'Soyez notifié immédiatement si une sortie dépasse le temps prévu.',
  },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* NAV */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800">
        <span className="text-xl font-bold tracking-tight text-sky-400">RowingLogBook</span>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition"
          >
            Connexion
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-sky-500 hover:bg-sky-400 text-white transition"
          >
            Créer un compte
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 text-sky-400 text-sm font-medium">
          🏅 Logbook officiel de votre club
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight max-w-4xl">
          Gardez le cap<br />
          <span className="text-sky-400">sur chaque sortie.</span>
        </h1>

        <p className="text-lg text-slate-400 max-w-xl leading-relaxed">
          RowingLogBook centralise la gestion des sorties, des bateaux et des membres
          de votre club d'aviron — simplement et efficacement.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-2">
          <button
            onClick={() => navigate('/register')}
            className="px-8 py-3.5 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 text-white text-base transition shadow-lg shadow-sky-500/20"
          >
            Commencer gratuitement →
          </button>
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3.5 rounded-xl font-semibold border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-base transition"
          >
            Se connecter
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-3 p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-sky-500/40 transition"
            >
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-6 text-center text-slate-600 text-sm">
        © {new Date().getFullYear()} RowingLogBook — Fait avec ❤️ pour le club
      </footer>
    </div>
  )
}
