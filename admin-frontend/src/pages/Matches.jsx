import { useCallback, useEffect, useMemo, useState } from "react";

import DashboardHeader from "../components/DashboardHeader";
import CreateMatchSection from "../features/matches/CreateMatchSection";
import MatchesTable from "../features/matches/MatchesTable";
import {
  getParticipantPayload,
  validateMatchParticipants,
} from "../features/matches/utils";
import {
  createMatch,
  fetchEvents,
  fetchMatchParticipants,
  fetchMatches,
  fetchSportsList,
  setMatchResult,
  subscribeToMatchUpdates,
  updateLiveMatchScore,
  updateMatchStatus,
} from "../services/adminApi";
import { normalizeSports } from "../utils/sports";
import { supportsLiveScore } from "../features/matches/utils";

export default function Matches({ user }) {
  const [sportsMeta, setSportsMeta] = useState([]);
  const [events, setEvents] = useState([]);

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
  const [liveScoreSavingId, setLiveScoreSavingId] = useState(null);

  const [scoreA, setScoreA] = useState({});
  const [scoreB, setScoreB] = useState({});

  const assignedSports = useMemo(() => user?.assignedSports ?? [], [user]);
  const sports = useMemo(
    () => {
      const registeredSports = normalizeSports(sportsMeta)
        .filter((sport) => assignedSports.includes(sport.sportId))
        .map((sport) => ({
          ...sport,
          scoringMode: sport.scoringMode || (supportsLiveScore(sport.sportId) ? "points" : "result"),
          eventName: "Existing sports",
        }));
      const eventSports = events.flatMap((event) =>
        (event.sports || []).map((sport) => ({
          ...sport,
          eventId: event.eventId,
          eventName: event.eventName,
          sportType: "custom",
        })),
      );
      return [...registeredSports, ...eventSports];
    },
    [sportsMeta, events, assignedSports],
  );

  const visibleSportIds = useMemo(
    () => new Set([...assignedSports, ...sports.filter((sport) => sport.eventId).map((sport) => sport.sportId)]),
    [assignedSports, sports],
  );

  const fetchVisibleMatches = useCallback(
    async (activeSportId, { signal } = {}) => {
      const json = await fetchMatches(
        { sportId: activeSportId, page: 1, limit: 200 },
        { signal },
      );
      const fetchedMatches = json.data || [];

      if (activeSportId) {
        return fetchedMatches;
      }

      return fetchedMatches.filter((match) =>
        visibleSportIds.has(match.sportId),
      );
    },
    [visibleSportIds],
  );

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadSports() {
      try {
        const [sportsResponse, eventsResponse] = await Promise.all([
          fetchSportsList({ signal: controller.signal }),
          fetchEvents({ signal: controller.signal }),
        ]);
        if (!cancelled) {
          setSportsMeta(sportsResponse.data || []);
          setEvents(eventsResponse.data || []);
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
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

    async function syncMatches() {
      setMatchesLoading(true);
      setMatchesError("");
      try {
        const filteredMatches = await fetchVisibleMatches(listSportId, {
          signal: controller.signal,
        });
        if (!cancelled) {
          setMatches(filteredMatches);
        }
      } catch (e) {
        if (e?.name === "AbortError") return;
        if (!cancelled) setMatchesError(e?.message || "Failed to load matches");
      } finally {
        if (!cancelled) setMatchesLoading(false);
      }
    }

    syncMatches();
    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [fetchVisibleMatches, listSportId]);

  useEffect(() => {
    let cancelled = false;
    const unsubscribe = subscribeToMatchUpdates((updatedMatches) => {
      if (cancelled) return;

      const visibleMatches = (updatedMatches || []).filter((match) =>
        listSportId
          ? match.sportId === listSportId
          : visibleSportIds.has(match.sportId),
      );
      setMatches(visibleMatches);
      setMatchesError("");
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [listSportId, visibleSportIds]);

  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    async function loadParticipants() {
      setParticipants([]);
      setRegistrationIdA("");
      setRegistrationIdB("");
      setCustomNameA("");
      setCustomNameB("");

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

  const reloadMatches = useCallback(
    async (activeSportId = listSportId) => {
      const filteredMatches = await fetchVisibleMatches(activeSportId);
      setMatches(filteredMatches);
    },
    [fetchVisibleMatches, listSportId],
  );

  async function onCreateMatch() {
    setCreateError("");
    if (!createSportId) {
      setCreateError("Select a sport first");
      return;
    }

    const participantA = getParticipantPayload(registrationIdA, customNameA);
    const participantB = getParticipantPayload(registrationIdB, customNameB);
    const validationError = validateMatchParticipants(
      participantA,
      participantB,
    );

    if (validationError) {
      setCreateError(validationError);
      return;
    }

    setCreateLoading(true);
    try {
      const selectedSport = sports.find((s) => s.sportId === createSportId);
      await createMatch({
        sportId: createSportId,
        sportName: selectedSport?.sportName || "",
        sportCategory: selectedSport?.sportCategory || "",
        eventId: selectedSport?.eventId || "",
        scoringMode: selectedSport?.scoringMode || "result",
        registrationIdA: participantA.registrationId || "",
        nameA: participantA.name || "",
        registrationIdB: participantB.registrationId || "",
        nameB: participantB.name || "",
        scheduledAt: scheduledAt || null,
      });

      await reloadMatches();

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
      await reloadMatches();
      // Clear scores
      setScoreA((prev) => ({ ...prev, [matchId]: undefined }));
      setScoreB((prev) => ({ ...prev, [matchId]: undefined }));
    } catch (e) {
      setMatchesError(e?.message || "Failed to set result");
    } finally {
      setResultSavingId(null);
    }
  }

  async function onUpdateLiveScore(matchId) {
    const matchScoreA = scoreA[matchId] || null;
    const matchScoreB = scoreB[matchId] || null;
    setLiveScoreSavingId(matchId);
    try {
      await updateLiveMatchScore({
        matchId,
        scoreA: matchScoreA,
        scoreB: matchScoreB,
      });
      await reloadMatches();
    } catch (e) {
      setMatchesError(e?.message || "Failed to update live score");
    } finally {
      setLiveScoreSavingId(null);
    }
  }

  async function onStartMatch(matchId) {
    setStatusUpdatingId(matchId);
    try {
      await updateMatchStatus({ matchId, status: "ongoing" });
      await reloadMatches();
    } catch (e) {
      setMatchesError(e?.message || "Failed to start match");
    } finally {
      setStatusUpdatingId(null);
    }
  }

  return (
    <div>
      <DashboardHeader count={matches.length} total={matches.length} />

      <CreateMatchSection
        createError={createError}
        createLoading={createLoading}
        createSportId={createSportId}
        customNameA={customNameA}
        customNameB={customNameB}
        onCreateMatch={onCreateMatch}
        onCreateSportChange={setCreateSportId}
        onCustomNameAChange={setCustomNameA}
        onCustomNameBChange={setCustomNameB}
        onRegistrationAChange={setRegistrationIdA}
        onRegistrationBChange={setRegistrationIdB}
        onScheduledAtChange={setScheduledAt}
        participants={participants}
        participantsLoading={participantsLoading}
        registrationIdA={registrationIdA}
        registrationIdB={registrationIdB}
        scheduledAt={scheduledAt}
        sports={sports}
      />

      <MatchesTable
        listSportId={listSportId}
        liveScoreSavingId={liveScoreSavingId}
        matches={matches}
        matchesError={matchesError}
        matchesLoading={matchesLoading}
        onFilterSportChange={setListSportId}
        onSetWinner={onSetWinner}
        onStartMatch={onStartMatch}
        onUpdateLiveScore={onUpdateLiveScore}
        resultSavingId={resultSavingId}
        scoreA={scoreA}
        scoreB={scoreB}
        setScoreA={setScoreA}
        setScoreB={setScoreB}
        sports={sports}
        statusUpdatingId={statusUpdatingId}
      />
    </div>
  );
}
