import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, logout } from '../services/authService'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActiveSession {
  id: string
  boatName: string
  responsible: string
  departureTime: string // ISO string
  plannedDistanceKm: number
  crew: string[]
}

interface DashboardStats {
  activeSessions: ActiveSession[]
  closedToday: number
  availableBoats: number
  totalBoats: number
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function elapsed(departureISO: string): { h: number; m: number; s: number; totalMin: number } {
  const diff = Math.max(0, Math.floor((Date.now() - new Date(departureISO).getTime()) / 1000))
  const h = Math.floor(diff / 3600)
  const m = Math.floor((diff % 3600) / 60)
  const s = diff % 60
  return { h, m, s, totalMin: Math.floor(diff / 60) }
}

function formatElapsed(departureISO: string): string {
  const { h, m, s } = elapsed(departureISO)
  return [h > 0 ? `${h}h` : '', `${String(m).padStart(2, '0')}m`, `${String(s).padStart(2, '0')}s`]
    .filter(Boolean)
    .join(' ')
}

function alertLevel(departureISO: string): 'ok' | 'warn' | 'danger' {
  const { totalMin } = elapsed(departureISO)
  if (totalMin >= 180) return 'danger'
  if (totalMin >= 150) return 'warn'
  return 'ok'
}

const ROLE_LABEL: Record<string, string> = {
  ROWER: 'Rameur',
  STAFF: 'Staff',
  ADMIN: 'Administrateur',
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: string
  label: string
  value: string | number
  sub?: string
  accent?: string
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl bg-slate-900 border border-slate-800 p-5">
      <div className="flex items-center gap-2 text-slate-400 text-sm">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <p className={`text-3xl font-bold ${accent ?? 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}

function Timer({ departureISO }: { departureISO: string }) {
  const [, tick] = useState(0)
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000)
    return () => clearInterval(id)
  }, [])
  const level = alertLevel(departureISO)
  const cls =
    level === 'danger'
      ? 'text-red-400 font-semibold'
      : level === 'warn'
        ? 'text-amber-400 font-semibold'
        : 'text-white'
  return <span className={cls}>{formatElapsed(departureISO)}</span>
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const navigate = useNavigate()
  const user = getUser()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: remplacer par les vrais appels API quand les endpoints /sessions seront disponibles
    const fakeLoad = setTimeout(() => {
      setStats({
        activeSessions: [],
        closedToday: 0,
        availableBoats: 0,
        totalBoats: 0,
      })
      setLoading(false)
    }, 600)
    return () => clearTimeout(fakeLoad)
  }, [])

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">

      {/* ── TOP NAV ── */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-sky-400 font-bold text-lg tracking-tight">RowingLogBook</span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline text-slate-400 text-sm">Tableau de bord</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user?.email ?? '—'}</p>
            <p className="text-xs text-slate-500">{ROLE_LABEL[user?.role ?? ''] ?? user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 rounded-lg text-sm text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition"
          >
            Déconnexion
          </button>
        </div>
      </header>

      {/* ── CONTENT ── */}
      <main className="flex-1 px-6 py-8 max-w-7xl mx-auto w-full flex flex-col gap-8">

        {/* Title row */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">Tableau de bord</h1>
            <p className="text-slate-400 text-sm mt-0.5">
              {new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <button
            disabled
            title="Bientôt disponible"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold bg-sky-500 hover:bg-sky-400 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm transition shadow-lg shadow-sky-500/20"
          >
            <span className="text-base">🚣</span> Nouvelle sortie
          </button>
        </div>

        {/* KPIs */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : error ? null : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              icon="🌊"
              label="Sorties en cours"
              value={stats!.activeSessions.length}
              accent={stats!.activeSessions.length > 0 ? 'text-sky-400' : 'text-white'}
              sub="sur l'eau en ce moment"
            />
            <KpiCard
              icon="✅"
              label="Clôturées aujourd'hui"
              value={stats!.closedToday}
              sub="sorties terminées"
            />
            <KpiCard
              icon="⚓"
              label="Bateaux disponibles"
              value={stats!.availableBoats}
              sub={`sur ${stats!.totalBoats} au total`}
            />
            <KpiCard
              icon="🔔"
              label="Alertes actives"
              value={stats!.activeSessions.filter((s) => alertLevel(s.departureTime) === 'danger').length}
              accent={
                stats!.activeSessions.some((s) => alertLevel(s.departureTime) === 'danger')
                  ? 'text-red-400'
                  : 'text-white'
              }
              sub="sorties > 3h"
            />
          </div>
        )}

        {/* Active sessions table */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Sorties en cours</h2>
            {stats && stats.activeSessions.length > 0 && (
              <span className="text-xs text-slate-500">Mis à jour en temps réel</span>
            )}
          </div>

          {loading ? (
            <div className="h-40 rounded-2xl bg-slate-900 border border-slate-800 animate-pulse" />
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl bg-slate-900 border border-red-500/20 text-red-400">
              <span className="text-3xl">⚠️</span>
              <p className="text-sm">{error}</p>
            </div>
          ) : stats!.activeSessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl bg-slate-900 border border-slate-800 text-slate-500">
              <span className="text-4xl">⚓</span>
              <p className="font-medium text-slate-400">Aucune sortie en cours</p>
              <p className="text-sm">Tous les bateaux sont à quai.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-900 text-slate-400 text-left">
                    <th className="px-4 py-3 font-medium">Bateau</th>
                    <th className="px-4 py-3 font-medium">Responsable</th>
                    <th className="px-4 py-3 font-medium">Équipage</th>
                    <th className="px-4 py-3 font-medium">Départ</th>
                    <th className="px-4 py-3 font-medium">Durée</th>
                    <th className="px-4 py-3 font-medium">Dist. prévue</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {stats!.activeSessions.map((session, idx) => {
                    const level = alertLevel(session.departureTime)
                    return (
                      <tr
                        key={session.id}
                        className={`border-t border-slate-800 transition ${level === 'danger' ? 'bg-red-500/5' : level === 'warn' ? 'bg-amber-500/5' : idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/50'}`}
                      >
                        <td className="px-4 py-3 font-medium">{session.boatName}</td>
                        <td className="px-4 py-3 text-slate-300">{session.responsible}</td>
                        <td className="px-4 py-3 text-slate-400 text-xs">
                          {session.crew.length > 0 ? session.crew.join(', ') : <span className="italic">—</span>}
                        </td>
                        <td className="px-4 py-3 text-slate-400">
                          {new Date(session.departureTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="px-4 py-3">
                          <Timer departureISO={session.departureTime} />
                        </td>
                        <td className="px-4 py-3 text-slate-400">{session.plannedDistanceKm} km</td>
                        <td className="px-4 py-3">
                          <button
                            disabled
                            title="Bientôt disponible"
                            className="px-3 py-1 rounded-lg text-xs border border-slate-700 text-slate-400 hover:border-sky-500 hover:text-sky-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                          >
                            Clôturer
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Sortie proche de l'alerte (&gt; 2h30)</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400 inline-block" /> Alerte active (&gt; 3h)</span>
        </div>
      </main>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-800 py-4 text-center text-slate-700 text-xs">
        RowingLogBook — v0.1.0
      </footer>
    </div>
  )
}
