import { useEffect, useMemo, useState } from "react";

import DashboardHeader from "../components/DashboardHeader";
import {
  createMatch,
  fetchMatchParticipants,
  fetchMatches,
  fetchSportsList,
  setMatchResult,
  updateMatchStatus,
} from "../services/adminApi";

function normalizeSports(sportsMeta) {
  return (sportsMeta || [])
    .filter((s) => s && s.sportId && s.sportName)
    .map((s) => ({
      sportId: s.sportId,
      sportName: s.sportName,
      sportCategory: s.sportCategory,
    }));
}

function participantLabel(p) {
  if (!p) return "-";
  return p.name || "-";
}

function formatStatus(status) {
  return status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "Scheduled";
}

export default function Matches({ user }) {
  const [sportsMeta, setSportsMeta] = useState([]);

  const [listSportId, setListSportId] = useState("");
  const [matches, setMatches] = useState([]);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [matchesError, setMatchesError] = useState("");

  const [createSportId, setCreateSportId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [participantsLoading, setParticipantsLoading] = useState(false);

  const [registrationIdA, setRegistrationIdA] = useState("");
  const [registrationIdB, setRegistrationIdB] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");

  const [customNameA, setCustomNameA] = useState("");
  const [customNameB, setCustomNameB] = useState("");

  const [scheduledAt, setScheduledAt] = useState("");

  const [resultSavingId, setResultSavingId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const [scoreA, setScoreA] = useState({});
  const [scoreB, setScoreB] = useState({});

  const assignedSports = user?.assignedSports || [];
  const sports = useMemo(
    () =>
      normalizeSports(sportsMeta).filter((s) =>
        assignedSports.includes(s.sportId),
      ),
    [sportsMeta, assignedSports],
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadSports() {
      try {
        const json = await fetchSportsList({ signal: controller.signal });
        if (!cancelled) setSportsMeta(json.data || []);
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (!cancelled) console.warn(e);
      }
    }

    loadSports();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadMatches() {
      setMatchesLoading(true);
      setMatchesError("");
      try {
        const json = await fetchMatches(
          { sportId: listSportId, page: 1, limit: 200 },
          { signal: controller.signal },
        );
        if (!cancelled) {
          let filtered = json.data || [];
          if (!listSportId) {
            filtered = filtered.filter((m) =>
              assignedSports.includes(m.sportId),
            );
          }
          setMatches(filtered);
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (!cancelled) setMatchesError(e?.message || "Failed to load matches");
      } finally {
        if (!cancelled) setMatchesLoading(false);
      }
    }

    loadMatches();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [listSportId]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadParticipants() {
      setParticipants([]);
      setRegistrationIdA("");
      setRegistrationIdB("");

      if (!createSportId) return;

      setParticipantsLoading(true);
      try {
        const json = await fetchMatchParticipants(
          { sportId: createSportId },
          { signal: controller.signal },
        );
        if (!cancelled) setParticipants(json.data || []);
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (!cancelled) console.warn(e);
      } finally {
        if (!cancelled) setParticipantsLoading(false);
      }
    }

    loadParticipants();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [createSportId]);

  async function onCreateMatch() {
    setCreateError("");
    if (!createSportId) {
      setCreateError("Select a sport first");
      return;
    }

    const participantA =
      registrationIdA === "others"
        ? { name: customNameA.trim() }
        : { registrationId: registrationIdA };
    const participantB =
      registrationIdB === "others"
        ? { name: customNameB.trim() }
        : { registrationId: registrationIdB };

    if (!participantA.registrationId && !participantA.name) {
      setCreateError("Select or enter Student A");
      return;
    }
    if (!participantB.registrationId && !participantB.name) {
      setCreateError("Select or enter Student B");
      return;
    }
    if (
      participantA.registrationId &&
      participantB.registrationId &&
      participantA.registrationId === participantB.registrationId
    ) {
      setCreateError("Students must be different");
      return;
    }
    if (
      participantA.name &&
      participantB.name &&
      participantA.name === participantB.name
    ) {
      setCreateError("Students must be different");
      return;
    }

    setCreateLoading(true);
    try {
      const selectedSport = sports.find((s) => s.sportId === createSportId);
      await createMatch({
        sportId: createSportId,
        sportName: selectedSport?.sportName || "",
        sportCategory: selectedSport?.sportCategory || "",
        registrationIdA: participantA.registrationId || "",
        nameA: participantA.name || "",
        registrationIdB: participantB.registrationId || "",
        nameB: participantB.name || "",
        scheduledAt: scheduledAt || null,
      });

      // Refresh match list (across all sports)
      const json = await fetchMatches({
        sportId: listSportId,
        page: 1,
        limit: 200,
      });
      setMatches(json.data || []);

      // Reset selection
      setRegistrationIdA("");
      setRegistrationIdB("");
      setCustomNameA("");
      setCustomNameB("");
      setScheduledAt("");
    } catch (e) {
      setCreateError(e?.message || "Failed to create match");
    } finally {
      setCreateLoading(false);
    }
  }

  async function onSetWinner(matchId, winnerRegistrationId, winnerName) {
    const matchScoreA = scoreA[matchId] || null;
    const matchScoreB = scoreB[matchId] || null;
    setResultSavingId(matchId);
    try {
      await setMatchResult({
        matchId,
        winnerRegistrationId,
        winnerName,
        scoreA: matchScoreA,
        scoreB: matchScoreB,
      });
      const json = await fetchMatches({
        sportId: listSportId,
        page: 1,
        limit: 200,
      });
      let filtered = json.data || [];
      if (!listSportId) {
        filtered = filtered.filter((m) => assignedSports.includes(m.sportId));
      }
      setMatches(filtered);
      // Clear scores
      setScoreA((prev) => ({ ...prev, [matchId]: undefined }));
      setScoreB((prev) => ({ ...prev, [matchId]: undefined }));
    } catch (e) {
      setMatchesError(e?.message || "Failed to set result");
    } finally {
      setResultSavingId(null);
    }
  }

  async function onStartMatch(matchId) {
    setStatusUpdatingId(matchId);
    try {
      await updateMatchStatus({ matchId, status: "ongoing" });
      const json = await fetchMatches({
        sportId: listSportId,
        page: 1,
        limit: 200,
      });
      let filtered = json.data || [];
      if (!listSportId) {
        filtered = filtered.filter((m) => assignedSports.includes(m.sportId));
      }
      setMatches(filtered);
    } catch (e) {
      setMatchesError(e?.message || "Failed to start match");
    } finally {
      setStatusUpdatingId(null);
    }
  }

  return (
    <div>
      <DashboardHeader count={matches.length} total={matches.length} />

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Create match
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              Pick a sport and select two student names.
            </p>
          </div>

          {createError ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createError}
            </div>
          ) : null}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700">
              Sport
            </label>
            <select
              value={createSportId}
              onChange={(e) => setCreateSportId(e.target.value)}
              disabled={createLoading}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            >
              <option value="">Select sport</option>
              {sports.map((s) => (
                <option key={s.sportId} value={s.sportId}>
                  {(s.sportCategory ? `${s.sportCategory} · ` : "") +
                    s.sportName}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Student A
            </label>
            <select
              value={registrationIdA}
              onChange={(e) => setRegistrationIdA(e.target.value)}
              disabled={!createSportId || participantsLoading || createLoading}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            >
              <option value="">Select</option>
              {participants.map((p) => (
                <option key={p.registrationId} value={p.registrationId}>
                  {participantLabel(p)}
                </option>
              ))}
              <option value="others">Others</option>
            </select>
            {registrationIdA === "others" && (
              <input
                type="text"
                value={customNameA}
                onChange={(e) => setCustomNameA(e.target.value)}
                placeholder="Enter name"
                disabled={createLoading}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700">
              Student B
            </label>
            <select
              value={registrationIdB}
              onChange={(e) => setRegistrationIdB(e.target.value)}
              disabled={!createSportId || participantsLoading || createLoading}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            >
              <option value="">Select</option>
              {participants.map((p) => (
                <option key={p.registrationId} value={p.registrationId}>
                  {participantLabel(p)}
                </option>
              ))}
              <option value="others">Others</option>
            </select>
            {registrationIdB === "others" && (
              <input
                type="text"
                value={customNameB}
                onChange={(e) => setCustomNameB(e.target.value)}
                placeholder="Enter name"
                disabled={createLoading}
                className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              />
            )}
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm font-medium text-slate-700">
              Scheduled Time (optional)
            </label>
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              disabled={createLoading}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={onCreateMatch}
              disabled={createLoading}
              className="mt-6 h-11 w-full rounded-xl bg-slate-900 px-4 text-sm font-semibold text-white shadow-sm disabled:opacity-60"
            >
              {createLoading ? "Creating…" : "Create"}
            </button>
          </div>
        </div>

        {participantsLoading ? (
          <p className="mt-3 text-sm text-slate-500">Loading students…</p>
        ) : null}
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Matches</h2>
            <p className="mt-1 text-sm text-slate-600">
              Across all sports (use filter to narrow).
            </p>
          </div>

          <div className="w-full md:w-90">
            <label className="block text-sm font-medium text-slate-700">
              Filter by sport
            </label>
            <select
              value={listSportId}
              onChange={(e) => setListSportId(e.target.value)}
              disabled={matchesLoading}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            >
              <option value="">All sports</option>
              {sports.map((s) => (
                <option key={s.sportId} value={s.sportId}>
                  {(s.sportCategory ? `${s.sportCategory} · ` : "") +
                    s.sportName}
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
                matches.map((m) => {
                  const a = m.participants?.[0];
                  const b = m.participants?.[1];
                  const winnerId = m.winnerRegistrationId;
                  const winnerName = m.winnerName;

                  return (
                    <tr key={m._id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-900">
                        <div className="font-medium">{m.sportName || "-"}</div>
                        <div className="mt-0.5 text-xs text-slate-500">
                          {m.sportCategory || ""}
                        </div>
                      </td>

                      <td className="px-4 py-3 text-slate-900">
                        <div className="font-medium">
                          {a?.name || "-"}{" "}
                          <span className="text-slate-400">vs</span>{" "}
                          {b?.name || "-"}
                        </div>
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={
                            "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold " +
                            (m.status === "finished"
                              ? "bg-emerald-50 text-emerald-700"
                              : m.status === "ongoing"
                                ? "bg-yellow-50 text-yellow-700"
                                : "bg-slate-100 text-slate-700")
                          }
                        >
                          {formatStatus(m.status)}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-slate-600">
                        {m.scheduledAt ? (
                          <div>
                            <div className="text-sm">
                              {new Date(m.scheduledAt).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-slate-500">
                              {new Date(m.scheduledAt).toLocaleTimeString()}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="px-4 py-3">
                        {m.status === "finished" ? (
                          <div className="text-slate-900">
                            Winner:{" "}
                            <span className="font-medium">
                              {winnerName || "-"}
                            </span>
                            {m.scoreA !== null && m.scoreB !== null && (
                              <span className="ml-2 text-sm text-slate-500">
                                ({m.scoreA} - {m.scoreB})
                              </span>
                            )}
                          </div>
                        ) : m.status === "scheduled" ? (
                          <button
                            type="button"
                            onClick={() => onStartMatch(m._id)}
                            disabled={statusUpdatingId === m._id}
                            className="h-10 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-60"
                          >
                            {statusUpdatingId === m._id
                              ? "Starting…"
                              : "Start Match"}
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-slate-600">
                                {a?.name || "A"} Score
                              </label>
                              <input
                                type="text"
                                value={scoreA[m._id] || ""}
                                onChange={(e) =>
                                  setScoreA((prev) => ({
                                    ...prev,
                                    [m._id]: e.target.value || undefined,
                                  }))
                                }
                                placeholder="Score"
                                disabled={resultSavingId === m._id}
                                className="h-8 w-20 rounded border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <label className="text-xs text-slate-600">
                                {b?.name || "B"} Score
                              </label>
                              <input
                                type="text"
                                value={scoreB[m._id] || ""}
                                onChange={(e) =>
                                  setScoreB((prev) => ({
                                    ...prev,
                                    [m._id]: e.target.value || undefined,
                                  }))
                                }
                                placeholder="Score"
                                disabled={resultSavingId === m._id}
                                className="h-8 w-20 rounded border border-slate-300 bg-white px-2 text-sm text-slate-900 outline-none focus:border-slate-900"
                              />
                            </div>
                            <select
                              defaultValue={""}
                              onChange={(e) => {
                                const val = e.target.value;
                                if (val === "A") {
                                  onSetWinner(
                                    m._id,
                                    a?.registrationId,
                                    a?.name,
                                  );
                                } else if (val === "B") {
                                  onSetWinner(
                                    m._id,
                                    b?.registrationId,
                                    b?.name,
                                  );
                                }
                              }}
                              disabled={resultSavingId === m._id}
                              className="h-10 rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                            >
                              <option value="">Set winner</option>
                              <option value="A">{a?.name || "-"}</option>
                              <option value="B">{b?.name || "-"}</option>
                            </select>
                            {resultSavingId === m._id ? (
                              <span className="text-xs text-slate-500">
                                Saving…
                              </span>
                            ) : null}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
