const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function fetchJson(path, { signal } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, { signal });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}

export async function fetchSportsList({ signal } = {}) {
  return fetchJson('/api/registrations/sports', { signal });
}

export async function fetchRegistrations(
  { sportId = '', q = '', page = 1, limit = 50 } = {},
  { signal } = {},
) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (sportId) params.set('sportId', sportId);
  if (q && String(q).trim()) params.set('q', String(q).trim());

  return fetchJson(`/api/registrations?${params.toString()}`, { signal });
}

export async function fetchMatchParticipants({ sportId }, { signal } = {}) {
  const params = new URLSearchParams();
  params.set('sportId', String(sportId || ''));
  return fetchJson(`/api/matches/participants?${params.toString()}`, { signal });
}

export async function fetchMatches(
  { sportId = '', page = 1, limit = 100 } = {},
  { signal } = {},
) {
  const params = new URLSearchParams();
  params.set('page', String(page));
  params.set('limit', String(limit));
  if (sportId) params.set('sportId', sportId);

  return fetchJson(`/api/matches?${params.toString()}`, { signal });
}

export async function createMatch(
  { sportId, registrationIdA, registrationIdB },
  { signal } = {},
) {
  const res = await fetch(`${API_BASE_URL}/api/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sportId, registrationIdA, registrationIdB }),
    signal,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json;
}

export async function setMatchResult(
  { matchId, winnerRegistrationId },
  { signal } = {},
) {
  const res = await fetch(`${API_BASE_URL}/api/matches/${matchId}/result`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ winnerRegistrationId }),
    signal,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.success) {
    throw new Error(json?.message || `Request failed (${res.status})`);
  }
  return json;
}
