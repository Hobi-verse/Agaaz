import {
  formatMatchStatus,
  formatScheduledDateTime,
  supportsLiveScore,
} from "./utils";

function MatchStatusBadge({ status }) {
  const toneClassName =
    status === "finished"
      ? "bg-emerald-50 text-emerald-700"
      : status === "ongoing"
        ? "bg-yellow-50 text-yellow-700"
        : "bg-slate-100 text-slate-700";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${toneClassName}`}
    >
      {formatMatchStatus(status)}
    </span>
  );
}

function MatchResultCell({
  liveScoreSavingId,
  match,
  onSetWinner,
  onStartMatch,
  onUpdateLiveScore,
  resultSavingId,
  scoreA,
  scoreB,
  setScoreA,
  setScoreB,
  statusUpdatingId,
}) {
  const participantA = match.participants?.[0];
  const participantB = match.participants?.[1];
  const canUseLiveScore = supportsLiveScore(match.sportId);
  const scoreValueA = scoreA[match._id] ?? match.scoreA ?? "";
  const scoreValueB = scoreB[match._id] ?? match.scoreB ?? "";
  const isBusy =
    resultSavingId === match._id || liveScoreSavingId === match._id;

  if (match.status === "finished") {
    return (
      <div className="text-slate-900">
        Winner: <span className="font-medium">{match.winnerName || "-"}</span>
        {match.scoreA !== null && match.scoreB !== null ? (
          <span className="ml-2 text-sm text-slate-500">
            ({match.scoreA} - {match.scoreB})
          </span>
        ) : null}
      </div>
    );
  }

  if (match.status === "scheduled") {
    return (
      <button
        type="button"
        onClick={() => onStartMatch(match._id)}
        disabled={statusUpdatingId === match._id}
        className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
      >
        {statusUpdatingId === match._id ? "Starting…" : "Start Match"}
      </button>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {canUseLiveScore ? (
        <div className="text-xs text-slate-500">
          {match.scoreA !== null || match.scoreB !== null ? (
            <span>
              Live score: {match.scoreA || 0} - {match.scoreB || 0}
            </span>
          ) : (
            <span>Live score not updated yet</span>
          )}

          {match.liveScoreUpdatedAt ? (
            <span className="ml-2">
              Updated {new Date(match.liveScoreUpdatedAt).toLocaleTimeString()}
            </span>
          ) : null}
        </div>
      ) : (
        <div className="text-xs text-slate-500">
          This sport uses result-only completion.
        </div>
      )}

      <div className="flex flex-wrap items-end gap-2">
        {canUseLiveScore ? (
          <>
            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">
                {participantA?.name || "A"} Score
              </label>
              <input
                type="text"
                value={scoreValueA}
                onChange={(event) =>
                  setScoreA((current) => ({
                    ...current,
                    [match._id]: event.target.value || undefined,
                  }))
                }
                placeholder="Score"
                disabled={isBusy}
                className="h-8 w-24 rounded border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs text-slate-600">
                {participantB?.name || "B"} Score
              </label>
              <input
                type="text"
                value={scoreValueB}
                onChange={(event) =>
                  setScoreB((current) => ({
                    ...current,
                    [match._id]: event.target.value || undefined,
                  }))
                }
                placeholder="Score"
                disabled={isBusy}
                className="h-8 w-24 rounded border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="button"
              onClick={() => onUpdateLiveScore(match._id)}
              disabled={isBusy}
              className="h-10 rounded-xl bg-amber-500 px-4 text-sm font-semibold text-white shadow-sm hover:bg-amber-600 disabled:opacity-60"
            >
              {liveScoreSavingId === match._id ? "Updating…" : "Update live"}
            </button>
          </>
        ) : null}

        <select
          defaultValue=""
          onChange={(event) => {
            const selectedValue = event.target.value;

            if (selectedValue === "A") {
              onSetWinner(match._id, participantA?.registrationId, participantA?.name);
            } else if (selectedValue === "B") {
              onSetWinner(match._id, participantB?.registrationId, participantB?.name);
            }
          }}
          disabled={isBusy}
          className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
        >
          <option value="">
            {canUseLiveScore ? "Finish and set winner" : "Set winner"}
          </option>
          <option value="A">{participantA?.name || "-"}</option>
          <option value="B">{participantB?.name || "-"}</option>
        </select>

        {isBusy ? <span className="text-xs text-slate-500">Saving…</span> : null}
      </div>
    </div>
  );
}

export default function MatchesTable({
  listSportId,
  liveScoreSavingId,
  matches,
  matchesError,
  matchesLoading,
  onFilterSportChange,
  onSetWinner,
  onStartMatch,
  onUpdateLiveScore,
  resultSavingId,
  scoreA,
  scoreB,
  setScoreA,
  setScoreB,
  sports,
  statusUpdatingId,
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Matches</h2>
          <p className="mt-1 text-sm text-slate-600">
            Live scoring is available only for point-based sports. Result-only
            events can still be finished normally.
          </p>
        </div>

        <div className="w-full md:w-90">
          <label className="block text-sm font-medium text-slate-700">
            Filter by sport
          </label>
          <select
            value={listSportId}
            onChange={(event) => onFilterSportChange(event.target.value)}
            disabled={matchesLoading}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            <option value="">All sports</option>
            {sports.map((sport) => (
              <option key={sport.sportId} value={sport.sportId}>
                {(sport.sportCategory ? `${sport.sportCategory} · ` : "") +
                  sport.sportName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {matchesError ? (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {matchesError}
        </div>
      ) : null}

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-225 border-collapse text-left text-sm">
          <thead className="bg-slate-50">
            <tr className="text-slate-700">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Sport
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Match
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Status
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Scheduled
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide">
                Result
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {matchesLoading ? (
              <tr>
                <td className="px-4 py-6 text-slate-600" colSpan={5}>
                  Loading matches…
                </td>
              </tr>
            ) : matches.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-600" colSpan={5}>
                  No matches yet.
                </td>
              </tr>
            ) : (
              matches.map((match) => {
                const participantA = match.participants?.[0];
                const participantB = match.participants?.[1];
                const scheduleInfo = formatScheduledDateTime(match.scheduledAt);

                return (
                  <tr key={match._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-slate-900">
                      <div className="font-medium">{match.sportName || "-"}</div>
                      <div className="mt-0.5 text-xs text-slate-500">
                        {match.sportCategory || ""}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-slate-900">
                      <div className="font-medium">
                        {participantA?.name || "-"}{" "}
                        <span className="text-slate-400">vs</span>{" "}
                        {participantB?.name || "-"}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <MatchStatusBadge status={match.status} />
                    </td>

                    <td className="px-4 py-3 text-slate-600">
                      {scheduleInfo ? (
                        <div>
                          <div className="text-sm">{scheduleInfo.date}</div>
                          <div className="text-xs text-slate-500">
                            {scheduleInfo.time}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <MatchResultCell
                        liveScoreSavingId={liveScoreSavingId}
                        match={match}
                        onSetWinner={onSetWinner}
                        onStartMatch={onStartMatch}
                        onUpdateLiveScore={onUpdateLiveScore}
                        resultSavingId={resultSavingId}
                        scoreA={scoreA}
                        scoreB={scoreB}
                        setScoreA={setScoreA}
                        setScoreB={setScoreB}
                        statusUpdatingId={statusUpdatingId}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
