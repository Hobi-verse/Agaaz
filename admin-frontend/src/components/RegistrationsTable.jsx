function TableCell({ children, className = "" }) {
  return <td className={`px-4 py-3 align-top ${className}`}>{children}</td>;
}

function EmptyState({ children }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-sm text-slate-600">
      {children}
    </div>
  );
}

export default function RegistrationsTable({ registrations, loading, error }) {
  if (error) {
    return (
      <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white px-4 py-10 text-center text-sm text-slate-600">
        Loading registrations…
      </div>
    );
  }

  if (!registrations.length) {
    return (
      <div className="mt-6">
        <EmptyState>No registrations found.</EmptyState>
      </div>
    );
  }

  return (
    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table
          style={{ minWidth: 1050 }}
          className="w-full border-collapse text-left text-sm"
        >
          <thead className="bg-slate-50">
            <tr className="text-slate-700">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Reg ID
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Student
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                University / Branch
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Contact
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Sport
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Team
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {registrations.map((r) => (
              <tr key={r._id || r.registrationId} className="hover:bg-slate-50">
                <TableCell className="font-mono text-xs text-slate-900">
                  {r.registrationId || "-"}
                </TableCell>

                <TableCell>
                  <div className="font-medium text-slate-900">
                    {r.name || "-"}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {r.branch || "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-slate-900">
                    {r.universityName || "-"}
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {r.branch || "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-slate-900">{r.mobileNo || "-"}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {r.email || "-"}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-slate-900">{r.sportName || "-"}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {(r.sportCategory ? `${r.sportCategory} · ` : "") +
                      (r.sportType || "-")}
                  </div>
                </TableCell>

                <TableCell>
                  <div className="text-slate-900">{r.teamName || "-"}</div>
                  <div className="mt-0.5 text-xs text-slate-500">
                    {r.teamSize ?? "-"}
                  </div>
                </TableCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
