export default function StaffPage() {
	return (
		<div className="min-h-screen bg-slate-950 text-slate-100">
			<header className="border-b border-slate-800 bg-slate-900/80">
				<div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
					<h1 className="text-xl font-semibold tracking-tight">RowingLogBook - Espace Staff</h1>
					<span className="rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 text-xs font-medium text-sky-300">
						STAFF
					</span>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl px-6 py-10">
				<section className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-xl shadow-slate-950/30">
					<h2 className="text-2xl font-semibold text-white">Tableau de bord</h2>
					<p className="mt-2 text-sm text-slate-300">
						Page staff statique en dur pour maquette visuelle.
					</p>
				</section>

				<section className="mt-6 grid gap-4 md:grid-cols-3">
					<article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
						<p className="text-sm text-slate-400">Sorties en cours</p>
						<p className="mt-2 text-3xl font-bold text-white">--</p>
					</article>
					<article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
						<p className="text-sm text-slate-400">Alertes actives</p>
						<p className="mt-2 text-3xl font-bold text-white">--</p>
					</article>
					<article className="rounded-xl border border-slate-800 bg-slate-900 p-4">
						<p className="text-sm text-slate-400">Bateaux disponibles</p>
						<p className="mt-2 text-3xl font-bold text-white">--</p>
					</article>
				</section>

				<section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900 p-6">
					<h3 className="text-lg font-semibold text-white">Actions rapides</h3>
					<div className="mt-4 flex flex-wrap gap-3">
						<button type="button" className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
							Voir les sorties
						</button>
						<button type="button" className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
							Historique
						</button>
						<button type="button" className="rounded-lg border border-slate-700 px-4 py-2 text-sm hover:bg-slate-800">
							Statistiques
						</button>
					</div>
				</section>
			</main>
		</div>
	)
}
