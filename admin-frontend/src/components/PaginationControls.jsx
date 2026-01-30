export default function PaginationControls({
  page,
  totalPages,
  onPrev,
  onNext,
  loading,
}) {
  return (
    <div className="mt-4 flex items-center justify-between gap-4">
      <div className="text-sm text-slate-600">
        Page <span className="font-medium text-slate-900">{page}</span> of{" "}
        <span className="font-medium text-slate-900">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrev}
          disabled={page <= 1 || loading}
          className="h-10 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm disabled:opacity-50"
        >
          Prev
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={page >= totalPages || loading}
          className="h-10 rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-900 shadow-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
