import { useEffect, useMemo, useState } from "react";
import {
  addEventSport,
  createEvent,
  fetchEvents,
} from "../services/adminApi";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [activeEventId, setActiveEventId] = useState("");
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [sportName, setSportName] = useState("");
  const [sportCategory, setSportCategory] = useState("");
  const [scoringMode, setScoringMode] = useState("points");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const activeEvent = useMemo(
    () => events.find((event) => event.eventId === activeEventId),
    [activeEventId, events],
  );

  useEffect(() => {
    let cancelled = false;
    fetchEvents()
      .then((response) => {
        if (!cancelled) {
          const loadedEvents = response.data || [];
          setEvents(loadedEvents);
          setActiveEventId((current) => current || loadedEvents[0]?.eventId || "");
        }
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || "Failed to load events");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleCreateEvent(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const response = await createEvent({ eventName, description });
      const createdEvent = response.data;
      setEvents((current) => [createdEvent, ...current]);
      setActiveEventId(createdEvent.eventId);
      setEventName("");
      setDescription("");
      setMessage("Event created. Add its sports below.");
    } catch (requestError) {
      setError(requestError.message || "Failed to create event");
    } finally {
      setSaving(false);
    }
  }

  async function handleAddSport(event) {
    event.preventDefault();
    if (!activeEventId) return;
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const response = await addEventSport({
        eventId: activeEventId,
        sportName,
        sportCategory,
        scoringMode,
      });
      setEvents((current) =>
        current.map((item) =>
          item.eventId === activeEventId ? response.data : item,
        ),
      );
      setSportName("");
      setSportCategory("");
      setScoringMode("points");
      setMessage("Sport added to the event.");
    } catch (requestError) {
      setError(requestError.message || "Failed to add sport");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Create an event</h2>
        <p className="mt-1 text-sm text-slate-600">
          Group any number of sports under a tournament, fest, league, or meet.
        </p>
        <form onSubmit={handleCreateEvent} className="mt-4 grid gap-4 md:grid-cols-12">
          <label className="md:col-span-4">
            <span className="block text-sm font-medium text-slate-700">Event name</span>
            <input
              required
              maxLength={100}
              value={eventName}
              onChange={(event) => setEventName(event.target.value)}
              placeholder="e.g. Inter-college Sports Meet"
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            />
          </label>
          <label className="md:col-span-6">
            <span className="block text-sm font-medium text-slate-700">Description (optional)</span>
            <input
              maxLength={500}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="A short description for organizers"
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900"
            />
          </label>
          <div className="flex items-end md:col-span-2">
            <button disabled={saving} className="h-11 w-full rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">
              {saving ? "Saving…" : "Create event"}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Sports in your events</h2>
            <p className="mt-1 text-sm text-slate-600">Choose how each sport records its match result.</p>
          </div>
          <label className="w-full md:w-96">
            <span className="block text-sm font-medium text-slate-700">Event collection</span>
            <select
              value={activeEventId}
              onChange={(event) => setActiveEventId(event.target.value)}
              className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-900"
            >
              <option value="">Select an event</option>
              {events.map((item) => <option key={item.eventId} value={item.eventId}>{item.eventName}</option>)}
            </select>
          </label>
        </div>

        {activeEvent ? (
          <>
            <form onSubmit={handleAddSport} className="mt-5 grid gap-4 md:grid-cols-12">
              <label className="md:col-span-4">
                <span className="block text-sm font-medium text-slate-700">Sport or event name</span>
                <input required maxLength={80} value={sportName} onChange={(event) => setSportName(event.target.value)} placeholder="e.g. 3x3 Basketball" className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900" />
              </label>
              <label className="md:col-span-3">
                <span className="block text-sm font-medium text-slate-700">Category (optional)</span>
                <input maxLength={60} value={sportCategory} onChange={(event) => setSportCategory(event.target.value)} placeholder="e.g. Women's" className="mt-1 h-11 w-full rounded-xl border border-slate-300 px-3 text-sm outline-none focus:border-slate-900" />
              </label>
              <label className="md:col-span-3">
                <span className="block text-sm font-medium text-slate-700">Scoring</span>
                <select value={scoringMode} onChange={(event) => setScoringMode(event.target.value)} className="mt-1 h-11 w-full rounded-xl border border-slate-300 bg-white px-3 text-sm outline-none focus:border-slate-900">
                  <option value="points">Live points</option>
                  <option value="result">Winner / result only</option>
                </select>
              </label>
              <div className="flex items-end md:col-span-2">
                <button disabled={saving} className="h-11 w-full rounded-xl bg-brand-700 px-4 text-sm font-semibold text-white hover:bg-brand-800 disabled:opacity-60">Add sport</button>
              </div>
            </form>

            <div className="mt-5 divide-y divide-slate-100 rounded-xl border border-slate-200">
              {(activeEvent.sports || []).length ? activeEvent.sports.map((sport) => (
                <div key={sport.sportId} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
                  <div>
                    <div className="font-medium text-slate-900">{sport.sportName}</div>
                    {sport.sportCategory ? <div className="text-sm text-slate-500">{sport.sportCategory}</div> : null}
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                    {sport.scoringMode === "points" ? "Live points" : "Result only"}
                  </span>
                </div>
              )) : <div className="px-4 py-5 text-sm text-slate-500">No sports added yet.</div>}
            </div>
          </>
        ) : <p className="mt-5 rounded-xl bg-slate-50 px-4 py-5 text-sm text-slate-600">Create an event to start adding sports.</p>}
      </section>

      {error ? <div role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div> : null}
      {message ? <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div> : null}
    </div>
  );
}
