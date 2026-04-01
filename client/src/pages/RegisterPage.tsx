import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { register, saveAuth } from '../services/authService'

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)
    try {
      const response = await register(firstName, lastName, email, password)
      saveAuth(response)
      navigate('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full bg-slate-950">

      {/* ── Panneau gauche — branding (desktop uniquement) ── */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">

        {/* Cercles décoratifs */}
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl" />

        {/* Logo */}
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Rowing<span className="text-blue-400">LogBook</span>
          </h1>
        </div>

        {/* Citation centrale */}
        <div className="relative z-10 space-y-6">
          <div className="w-12 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full" />
          <blockquote className="text-3xl xl:text-4xl font-semibold text-white leading-tight">
            Rejoins la<br />
            <span className="text-blue-400">communauté.</span>
          </blockquote>
          <p className="text-slate-400 text-lg max-w-sm">
            Crée ton compte gratuitement et commence à suivre tes entraînements dès aujourd'hui.
          </p>
        </div>

        {/* Avantages */}
        <div className="relative z-10 space-y-3">
          {[
            'Suivi de tes sessions en temps réel',
            'Analyse de ta progression sur le long terme',
            'Accès à l\'historique complet de tes sorties',
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <p className="text-slate-300 text-sm">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 bg-slate-950">

        {/* Logo mobile uniquement */}
        <div className="lg:hidden text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Rowing<span className="text-blue-400">LogBook</span>
          </h1>
          <p className="mt-2 text-slate-400 text-sm">
            Crée ton compte pour commencer
          </p>
        </div>

        <div className="w-full max-w-md">

          {/* Titre desktop */}
          <div className="hidden lg:block mb-8">
            <h2 className="text-2xl font-bold text-white">Créer un compte</h2>
            <p className="mt-1 text-slate-400 text-sm">C'est gratuit et ça prend 30 secondes</p>
          </div>

          {/* Card formulaire */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl px-8 py-10">

            <h3 className="text-lg font-semibold text-white mb-6 lg:hidden">Créer un compte</h3>

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Prénom + Nom */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Prénom
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Romain"
                    className="w-full rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-slate-300 mb-1.5">
                    Nom
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Dupont"
                    className="w-full rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Adresse e-mail
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@exemple.com"
                  className="w-full rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Mot de passe <span className="text-slate-500 font-normal">(8 caractères minimum)</span>
                </label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-300 mb-1.5">
                  Confirmer le mot de passe
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-800/60 border border-slate-700 text-white placeholder-slate-500 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Erreur */}
              {error && (
                <p className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
                  {error}
                </p>
              )}

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:from-blue-700 active:to-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all cursor-pointer shadow-lg shadow-blue-900/40 mt-1"
              >
                {loading ? 'Création du compte…' : 'Créer mon compte'}
              </button>
            </form>

            {/* Séparateur */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-500 text-xs">ou</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <p className="text-center text-sm text-slate-500">
              Déjà un compte ?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 transition-colors font-medium">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
