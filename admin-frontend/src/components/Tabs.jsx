export default function Tabs({ tabs, activeKey, onChange }) {
  return (
    <div className="inline-flex rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map((t) => {
        const active = t.key === activeKey;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            className={
              "h-10 rounded-lg px-4 text-sm font-medium transition " +
              (active
                ? "bg-slate-900 text-white"
                : "text-slate-700 hover:bg-slate-100")
            }
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
