import { Link, Outlet } from "@tanstack/react-router";

const tabBaseClass =
	"rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300";

export function RootLayout() {
	return (
		<main className="mx-auto max-w-6xl px-4 py-10 md:px-8">
			<nav
				aria-label="Primary"
				className="mb-8 flex gap-2 rounded-xl border border-slate-700/60 bg-slate-900/40 p-2"
			>
				<Link
					to="/products"
					className={tabBaseClass}
					activeProps={{
						className: `${tabBaseClass} bg-slate-100 text-slate-900`,
					}}
					inactiveProps={{
						className: `${tabBaseClass} text-slate-300 hover:bg-slate-800 hover:text-slate-100`,
					}}
				>
					Products
				</Link>
				<Link
					to="/settings"
					className={tabBaseClass}
					activeProps={{
						className: `${tabBaseClass} bg-slate-100 text-slate-900`,
					}}
					inactiveProps={{
						className: `${tabBaseClass} text-slate-300 hover:bg-slate-800 hover:text-slate-100`,
					}}
				>
					Settings
				</Link>

				<Link
					to="/slow"
					className={tabBaseClass}
					activeProps={{
						className: `${tabBaseClass} bg-slate-100 text-slate-900`,
					}}
					inactiveProps={{
						className: `${tabBaseClass} text-slate-300 hover:bg-slate-800 hover:text-slate-100`,
					}}
				>
					Slow
				</Link>
			</nav>

			<Outlet />
		</main>
	);
}
