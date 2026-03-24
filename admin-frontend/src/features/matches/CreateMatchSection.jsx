import { participantLabel } from "./utils";

export default function CreateMatchSection({
  createError,
  createLoading,
  createSportId,
  customNameA,
  customNameB,
  onCreateMatch,
  onCreateSportChange,
  onCustomNameAChange,
  onCustomNameBChange,
  onRegistrationAChange,
  onRegistrationBChange,
  onScheduledAtChange,
  participants,
  participantsLoading,
  registrationIdA,
  registrationIdB,
  scheduledAt,
  sports,
}) {
  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Create match</h2>
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
            onChange={(event) => onCreateSportChange(event.target.value)}
            disabled={createLoading}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            <option value="">Select sport</option>
            {sports.map((sport) => (
              <option key={sport.sportId} value={sport.sportId}>
                {(sport.sportCategory ? `${sport.sportCategory} · ` : "") +
                  sport.sportName}
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
            onChange={(event) => onRegistrationAChange(event.target.value)}
            disabled={!createSportId || participantsLoading || createLoading}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            <option value="">Select</option>
            {participants.map((participant) => (
              <option
                key={participant.registrationId}
                value={participant.registrationId}
              >
                {participantLabel(participant)}
              </option>
            ))}
            <option value="others">Others</option>
          </select>

          {registrationIdA === "others" ? (
            <input
              type="text"
              value={customNameA}
              onChange={(event) => onCustomNameAChange(event.target.value)}
              placeholder="Enter name"
              disabled={createLoading}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            />
          ) : null}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-700">
            Student B
          </label>
          <select
            value={registrationIdB}
            onChange={(event) => onRegistrationBChange(event.target.value)}
            disabled={!createSportId || participantsLoading || createLoading}
            className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
          >
            <option value="">Select</option>
            {participants.map((participant) => (
              <option
                key={participant.registrationId}
                value={participant.registrationId}
              >
                {participantLabel(participant)}
              </option>
            ))}
            <option value="others">Others</option>
          </select>

          {registrationIdB === "others" ? (
            <input
              type="text"
              value={customNameB}
              onChange={(event) => onCustomNameBChange(event.target.value)}
              placeholder="Enter name"
              disabled={createLoading}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none focus:border-slate-900"
            />
          ) : null}
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium text-slate-700">
            Scheduled Time (optional)
          </label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(event) => onScheduledAtChange(event.target.value)}
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
  );
}
