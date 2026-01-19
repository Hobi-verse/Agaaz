import { getApiBaseUrl } from "../services/adminApi";

export default function DashboardHeader({ count, total }) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Aagaaz Admin
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Registrations:{" "}
          <span className="font-medium text-slate-900">{count}</span> shown of{" "}
          <span className="font-medium text-slate-900">{total}</span>
        </p>
      </div>

      <div className="text-xs text-slate-500">
        API: <span className="font-mono text-slate-700">{getApiBaseUrl()}</span>
      </div>
    </header>
  );
}
