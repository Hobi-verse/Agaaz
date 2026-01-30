export default function RegistrationsFilters({
  sports,
  sportId,
  onSportChange,
  search,
  onSearchChange,
  limit,
  onLimitChange,
  loading,
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-4">
          <label className="block text-sm font-medium text-slate-700">
            Sport
          </label>
          <select
            value={sportId}
            onChange={(e) => onSportChange(e.target.value)}
            disabled={loading}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            <option value="">All sports</option>
            {sports.map((s) => (
              <option key={s.sportId} value={s.sportId}>
                {(s.sportCategory ? `${s.sportCategory} · ` : "") + s.sportName}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-5">
          <label className="block text-sm font-medium text-slate-700">
            Search
          </label>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={loading}
            placeholder="Name, email, reg ID, university…"
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-slate-900"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-slate-700">
            Per page
          </label>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            disabled={loading}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            {[25, 50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
}
